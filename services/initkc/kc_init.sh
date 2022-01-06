echo ------------------------------------------------------------------------------------------------------------------------
echo
echo KEYCLOAK INITIALISATION SCRIPT
echo
echo ------------------------------------------------------------------------------------------------------------------------
echo
echo "Waiting for containers to stabilise after startup..."
sleep 20

echo
echo "Install JSON Query..."
#install jq package for JSON querying
microdnf install jq > /dev/null

PATH=$PATH:/opt/jboss/keycloak/bin
OUTPUT_PATH=/docker-entrypoint-initdb.d

echo
echo "Login to Keycloak..."

# Login
kcadm.sh config credentials --server http://localhost:8080/auth --realm master --user ${KEYCLOAK_USER} --password ${KEYCLOAK_PASSWORD} --client admin-cli

# Generate realm template
cat $OUTPUT_PATH/template_realm.json |\
 sed "s|{{CLIENT}}|${CLIENT}|" | \
 sed "s|{{REALM_ID}}|${REALM_ID}|" | \
 sed "s|{{REALM_NAME}}|${REALM_NAME}|" | \
 sed "s|{{SMTP_PASSWORD}}|${SMTP_PASSWORD}|" | \
 sed "s|{{SMTP_SENDER_NAME}}|${SMTP_SENDER_NAME}|"  \
 > ${OUTPUT_PATH}/realm.json

# Create the realm
echo
echo "Create the realm: "${REALM_ID}
kcadm.sh create realms -s realm=${REALM_ID} -s enabled=true
kcadm.sh create partialImport -r ${REALM_ID} -s ifResourceExists=SKIP -f ${REALM_JSON}
echo

echo "Create API user: "${description}" with password: "${API_PASSWORD}
kcadm.sh create users -r ${REALM_ID} -s username=${API_USER} -s enabled=true -s "attributes.tenant_role=tenant_admin"
kcadm.sh set-password -r ${REALM_ID} --username=${API_USER} --new-password ${API_PASSWORD}


echo
echo "Create platform admin user: "${APP_ADMIN}" with password: "${USER_PW}
kcadm.sh create users -r ${REALM_ID} -s username=${APP_ADMIN} -s enabled=true -s "attributes.tenant_role=platform_admin" -s "attributes.tenant_id=admin"
kcadm.sh set-password -r ${REALM_ID} --username=${APP_ADMIN} --new-password ${USER_PW}

echo "Assign admin roles: "${APP_ADMIN}" with password: "${USER_PW}
kcadm.sh add-roles    -r ${REALM_ID} --uusername ${APP_ADMIN} --rolename ${APP_ADMIN_ROLE} 


echo
echo "Create Australian tenant admin user: oz_"${APP_ADMIN}" with password: "${USER_PW}
kcadm.sh create users -r ${REALM_ID} -s username="oz_"${APP_ADMIN} -s enabled=true -s "attributes.tenant_role=${TENANT_ADMIN_ROLE}" -s "attributes.tenant_id=perth"
kcadm.sh set-password -r ${REALM_ID} --username="oz_"${APP_ADMIN} --new-password ${USER_PW}

echo "Assign tenant_admin roles: oz_"${APP_ADMIN}" with password: "${USER_PW}
kcadm.sh add-roles    -r ${REALM_ID} --uusername="oz_"${APP_ADMIN} --rolename ${TENANT_ADMIN_ROLE} 


echo
echo "Create Scottish tenant admin user: scot_"${APP_ADMIN}" with password: "${USER_PW}
kcadm.sh create users -r ${REALM_ID} -s username="scot_"${APP_ADMIN} -s enabled=true -s "attributes.tenant_role=${TENANT_ADMIN_ROLE}" -s "attributes.tenant_id=arbroath"
kcadm.sh set-password -r ${REALM_ID} --username="scot_"${APP_ADMIN} --new-password ${USER_PW}

echo "Assign tenant_admin roles: scot_"${APP_ADMIN}" with password: "${USER_PW}
kcadm.sh add-roles    -r ${REALM_ID} --uusername="scot_"${APP_ADMIN} --rolename ${TENANT_ADMIN_ROLE} 


echo
echo "Create test user for 'perth' tenant: "${APP_USER}" with password: "${USER_PW}
kcadm.sh create users -r ${REALM_ID} -s username=${APP_USER} -s enabled=true -s "attributes.tenant_role=member" -s "attributes.tenant_id=perth"
kcadm.sh set-password -r ${REALM_ID} --username=${APP_USER} --new-password ${USER_PW}
kcadm.sh add-roles    -r ${REALM_ID} --uusername ${APP_USER} --rolename ${DEFAULT_ROLE}  

echo
echo "Capture the realm public key..."
#export the public key 
export KEY_TEXT=$(curl -s --request GET --url http://localhost:8080/auth/realms/${REALM_ID} | jq -r -c .public_key | sed -e 's/"//g')
export PUBLIC_KEY='-----BEGIN PUBLIC KEY-----\n'${KEY_TEXT}'\n-----END PUBLIC KEY-----' 
export KC_KEY='HASURA_GRAPHQL_JWT_SECRET={"type": "RS256", "key": "'${PUBLIC_KEY}'"}'

echo ${KC_KEY} > ${OUTPUT_PATH}/private_data/token.env
echo "Captured the realm public key into:"${OUTPUT_PATH}"/private_data/token.env"

# Test login with user credentials
echo 'Test authentication - request token for: oz_'${APP_ADMIN}
echo
export AUTH_TOKEN=$(curl -s --request POST --url http://localhost:8080/auth/realms/${REALM_ID}/protocol/openid-connect/token   --header 'Content-Type: application/x-www-form-urlencoded'   --data username="oz_"${APP_ADMIN}   --data password=${USER_PW}   --data grant_type=password   --data client_id=${CLIENT}  | jq -r -c .access_token | sed -e 's/"//g')
echo "Bearer "${AUTH_TOKEN} > ${OUTPUT_PATH}/private_data/auth_token.json
echo "Bearer token captured into: "${OUTPUT_PATH}"/private_data/auth_token.json"
echo
echo "** NOTE FOR DEBUGGING"
echo "Goto: https://jwt.io/ and paste the whole contents of the file into debugger web page"
echo "You can then verify all the components of the JWT token are in place with expected values."
echo

# Note for future if needed during test cycles...
# This command will delete the whole realm, users, clients...everything
#kcadm.sh delete realms/${REALM_ID}