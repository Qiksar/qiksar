# This script imports the Hasura Migrations, which alters the source database.
#
# We import in order to ensure everyone shares the same configuration for dev, test and prod.
#
hasura --database-name default  --project "${PWD}/hasura/hasura-migrations"  migrate apply
