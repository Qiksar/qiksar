# This script exports the Hasura Metadata, comprising how the GraphQL schema, permissions etc. are configured
# with respect to the database.
#
# We would export in order to add DB changes to source control, and so the changes can be applied to dev, test and prod 
# in a controlled manner.
#
hasura --database-name default --project "${PWD}/hasura/hasura-migrations" metadata export 