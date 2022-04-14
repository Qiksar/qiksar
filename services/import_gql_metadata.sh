# This script imports the Hasura Metadata, comprising how the GraphQL schema, permissions etc. are configured
# with respect to the database.
#
# We import in order to ensure everyone shares the same configuration for dev, test and prod.
#
hasura --project "${PWD}/hasura/hasura-migrations" metadata apply
