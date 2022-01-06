# In order for Keycloak to run against a remote database cluster we have to ensure the Keycloak schema exists
# This command will execute PSQL, in order to execute the database initiatlisation required for keycloak

export PGPASSWORD=${POSTGRES_ADMIN_PASSWORD}

# DESTROY THE DATABASE IF REQUIRED
psql -U ${POSTGRES_ADMIN_USER} -h ${POSTGRES_HOST} -p ${POSTGRES_HOST_PORT} -d ${POSTGRES_DEFAULT_DB} --set=sslmode=require -c "DROP DATABASE ${POSTGRES_DB};"

echo "Create the database (if it does not already exist)..."
psql -U ${POSTGRES_ADMIN_USER} -h ${POSTGRES_HOST} -p ${POSTGRES_HOST_PORT} -d ${POSTGRES_DEFAULT_DB} --set=sslmode=require -c "SELECT 1 FROM pg_database WHERE datname = '"${POSTGRES_DB}"';" | grep -q 1 \
|| psql -U ${POSTGRES_ADMIN_USER} -h ${POSTGRES_HOST} -p ${POSTGRES_HOST_PORT} -d ${POSTGRES_DEFAULT_DB} --set=sslmode=require -c "CREATE DATABASE ${POSTGRES_DB};"

psql -U ${POSTGRES_ADMIN_USER} -h ${POSTGRES_HOST} -p ${POSTGRES_HOST_PORT} -d ${POSTGRES_DEFAULT_DB} --set=sslmode=require -c "ALTER DATABASE ${POSTGRES_DB} OWNER TO ${POSTGRES_USER};"

echo "Create api user"
psql -U ${POSTGRES_ADMIN_USER} -h ${POSTGRES_HOST} -p ${POSTGRES_HOST_PORT} -d ${POSTGRES_DB} --set=sslmode=require -c "create user ${POSTGRES_USER} with encrypted password '"${POSTGRES_PASSWORD}"';"

echo "Create keycloak schema"
psql -U ${POSTGRES_ADMIN_USER} -h ${POSTGRES_HOST} -p ${POSTGRES_HOST_PORT} -d ${POSTGRES_DB} --set=sslmode=require -c "CREATE SCHEMA IF NOT EXISTS keycloak;"

echo "Assign ownership of schema to api user"
psql -U ${POSTGRES_ADMIN_USER} -h ${POSTGRES_HOST} -p ${POSTGRES_HOST_PORT} -d ${POSTGRES_DB} --set=sslmode=require -c "ALTER SCHEMA keycloak OWNER TO ${POSTGRES_USER};"
echo
