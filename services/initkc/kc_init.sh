echo ------------------------------------------------------------------------------------------------------------------------
echo
echo --  KEYCLOAK INITIALISATION SCRIPT
echo
echo ------------------------------------------------------------------------------------------------------------------------
echo
echo
echo "Install JSON Query..."
#install jq package for JSON querying
microdnf install jq > /dev/null

PATH=$PATH:/opt/jboss/keycloak/bin
OUTPUT_PATH=/docker-entrypoint-initdb.d

#USER_REQUIRED_ACTIONS=-s 'requiredActions=["VERIFY_EMAIL","UPDATE_PROFILE","CONFIGURE_TOTP","UPDATE_PASSWORD"]'


echo
echo "Wait for keycloak to complete the startup process..."
sleep 20

echo
echo "Login to Keycloak..."

# Login
kcadm.sh config credentials --server http://localhost:8080/auth --realm master --user ${KEYCLOAK_USER} --password ${KEYCLOAK_PASSWORD} --client admin-cli

# Generate realm template
cat $OUTPUT_PATH/template_realm.json |\
 sed "s|{{KEYCLOAK_ENDPOINT}}|${KEYCLOAK_ENDPOINT}|" | \
 sed "s|{{APP_URL}}|${APP_URL}|" | \
 sed "s|{{KEYCLOAK_CLIENT}}|${KEYCLOAK_CLIENT}|" | \
 sed "s|{{KEYCLOAK_REALM_UUID}}|${KEYCLOAK_REALM_UUID}|" | \
 sed "s|{{KEYCLOAK_REALM}}|${KEYCLOAK_REALM}|" | \
 sed "s|{{KEYCLOAK_CLIENT_SECRET}}|${KEYCLOAK_CLIENT_SECRET}|" | \
 sed "s|{{KEYCLOAK_REALM_NAME}}|${KEYCLOAK_REALM_NAME}|" | \
 sed "s|{{SMTP_PASSWORD}}|${SMTP_PASSWORD}|" | \
 sed "s|{{SMTP_SENDER_NAME}}|${SMTP_SENDER_NAME}|"  \
 > ${OUTPUT_PATH}/realm.json

# Create the realm
echo
echo "Create the realm: "${KEYCLOAK_REALM}
kcadm.sh create realms -s realm=${KEYCLOAK_REALM} -s enabled=true
kcadm.sh create partialImport -r ${KEYCLOAK_REALM} -s ifResourceExists=SKIP -f ${REALM_JSON}

echo
echo
echo ------------------------
echo "Configure the realm..."
echo ------------------------
echo
echo


echo "Capture the realm public key..."
#export the public key 
export KEY_TEXT=$(curl -s --request GET --url http://localhost:8080/auth/realms/${KEYCLOAK_REALM} | jq -r -c .public_key | sed -e 's/"//g')
export PUBLIC_KEY='-----BEGIN PUBLIC KEY-----\n'${KEY_TEXT}'\n-----END PUBLIC KEY-----' 
export KC_KEY='HASURA_GRAPHQL_JWT_SECRET={"type": "RS256", "key": "'${PUBLIC_KEY}'"}'

echo "KEYCLOAK_REALM_KEY="${KEY_TEXT} > ${OUTPUT_PATH}/private_data/realm_public_key.env
echo ${KC_KEY} > ${OUTPUT_PATH}/private_data/token.env
echo "Captured the realm public key into:"${OUTPUT_PATH}"/private_data/token.env"


echo
echo "Retrieve the API client ID"
export JQ_CLIENT_QUERY='.[] | select(.clientId=="${KEYCLOAK_APICLIENT}")'
export API_CLIENT_ID=$(kcadm.sh get clients -r app --fields id,clientId | jq '.[] | select(.clientId==env.KEYCLOAK_APICLIENT)' | jq '.id' | sed -e 's/"//g')

echo "Generate the API client secret"
kcadm.sh create -r ${KEYCLOAK_REALM} clients/${API_CLIENT_ID}/client-secret

export SECRET_PATH=clients/${API_CLIENT_ID}/client-secret
export API_CLIENT_SECRET=$(kcadm.sh get -r ${KEYCLOAK_REALM} ${SECRET_PATH} | jq '.value' | sed -e 's/"//g') 

echo
echo "KEYCLOAK_CLIENT_SECRET="${API_CLIENT_SECRET} > ${OUTPUT_PATH}/private_data/client_secret.env
echo "API client secret stored in: "${OUTPUT_PATH}"/private_data/client_secret.env"

echo
echo
echo ------------------------------------
echo "Create test users for the realm..."
echo ------------------------------------
echo
echo

echo "Create platform admin user: "${APP_ADMIN}" with password: "${USER_PW}
kcadm.sh create users -r ${KEYCLOAK_REALM} -s username=${APP_ADMIN} -s enabled=true -s "attributes.tenant_role=platform_admin" -s "attributes.tenant_id=admin" -s "attributes.tenant_role=tenant_admin" -s "attributes.firstName=Bob" -s "attributes.lastName=Willis" -s "email=bob@appadmin.com"
kcadm.sh set-password -r ${KEYCLOAK_REALM} --username=${APP_ADMIN} --new-password ${USER_PW}

echo "Assign admin roles: "${APP_ADMIN}
kcadm.sh add-roles    -r ${KEYCLOAK_REALM} --uusername ${APP_ADMIN} --rolename ${APP_ADMIN_ROLE} 


echo
echo "Create Australian tenant admin user: oz_"${APP_ADMIN}" with password: "${USER_PW}
# -s 'requiredActions=["UPDATE_PROFILE"]'
kcadm.sh create users -r ${KEYCLOAK_REALM} -s username="oz_"${APP_ADMIN} -s enabled=true -s "attributes.tenant_role=${TENANT_ADMIN_ROLE}" -s "attributes.tenant_id=perth"  -s "attributes.firstName=Bruce" -s "attributes.lastName=Cobber" -s "email=bruce@ozapp.com" -s "attributes.mobile_phone=+61 0456 789 012" -s "attributes.locale=en-AU" 
kcadm.sh set-password -r ${KEYCLOAK_REALM} --username="oz_"${APP_ADMIN} --new-password ${USER_PW}

echo "Assign tenant_admin roles: oz_"${APP_ADMIN}
kcadm.sh add-roles    -r ${KEYCLOAK_REALM} --uusername="oz_"${APP_ADMIN} --rolename ${TENANT_ADMIN_ROLE} 


echo
echo "Create Australian tenant admin user: "ozadmin" without key attributes set and password: "${USER_PW}
kcadm.sh create users -r ${KEYCLOAK_REALM} -s username="ozadmin" -s enabled=true -s "attributes.tenant_role=${TENANT_ADMIN_ROLE}" -s "attributes.tenant_id=perth"  -s 'requiredActions=["UPDATE_PROFILE","CONFIGURE_TOTP"]'
kcadm.sh set-password -r ${KEYCLOAK_REALM} --username="ozadmin" --new-password ${USER_PW}

echo "Assign tenant_admin roles: ozadmin"
kcadm.sh add-roles    -r ${KEYCLOAK_REALM} --uusername="ozadmin" --rolename ${TENANT_ADMIN_ROLE} 





echo
echo "Create Scottish tenant admin user: scot_"${APP_ADMIN}" with password: "${USER_PW}
# -s 'requiredActions=["UPDATE_PROFILE","CONFIGURE_TOTP"]' 
kcadm.sh create users -r ${KEYCLOAK_REALM} -s username="scot_"${APP_ADMIN} -s enabled=true -s "attributes.tenant_role=${TENANT_ADMIN_ROLE}" -s "attributes.tenant_id=arbroath"  -s "attributes.firstName=Alexander Graham" -s "attributes.lastName=Bell" -s "email=alex@scotmail.co.uk" -s "attributes.mobile_phone=+44 7766 123 456" -s "attributes.locale=en-UK" 
kcadm.sh set-password -r ${KEYCLOAK_REALM} --username="scot_"${APP_ADMIN} --new-password ${USER_PW}

echo "Assign tenant_admin roles: scot_"${APP_ADMIN}" with password: "${USER_PW}
kcadm.sh add-roles    -r ${KEYCLOAK_REALM} --uusername="scot_"${APP_ADMIN} --rolename ${TENANT_ADMIN_ROLE} 


echo
echo "Create test user for 'perth' tenant: "${APP_USER}" with password: "${USER_PW}
kcadm.sh create users -r ${KEYCLOAK_REALM} -s username=${APP_USER} -s enabled=true -s "attributes.tenant_role=member" -s "attributes.tenant_id=perth" -s "firstName=Angela" -s "lastName=Adelaide" -s "email=angela@ozemail.com.au" 
kcadm.sh set-password -r ${KEYCLOAK_REALM} --username=${APP_USER} --new-password ${USER_PW}
kcadm.sh add-roles    -r ${KEYCLOAK_REALM} --uusername ${APP_USER} --rolename ${DEFAULT_ROLE}  


# Test login with user credentials
echo 'Test authentication - request token for: oz_'${APP_ADMIN}
export AUTH_TOKEN=$(curl -s --request POST --url http://localhost:8080/auth/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token   --header 'Content-Type: application/x-www-form-urlencoded'   --data username="oz_"${APP_ADMIN}   --data password=${USER_PW}   --data grant_type=password   --data client_id=${KEYCLOAK_CLIENT}  | jq -r -c .access_token | sed -e 's/"//g')
echo "Bearer "${AUTH_TOKEN} > ${OUTPUT_PATH}/private_data/auth_token.json
echo "Bearer token captured into: "${OUTPUT_PATH}"/private_data/auth_token.json"
echo
echo "** NOTE FOR DEBUGGING"
echo "Goto: https://jwt.io/ and paste the whole contents of the file into debugger web page"
echo "You can then verify all the components of the JWT token are in place with expected values."
echo
echo

echo ------------------------------------------------------------------------------------------------------------------------
echo
echo --  KEYCLOAK CONFIGURATION COMPLETE
echo
echo ------------------------------------------------------------------------------------------------------------------------
echo
echo
