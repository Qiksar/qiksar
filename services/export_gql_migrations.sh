# This script exports the Hasura Migrations, comprising how to build the source database.
#
# We would export in order to add DB changes to source control, and so the changes can be applied to dev, test and prod 
# in a controlled manner.
#
hasura --project "${PWD}/hasura/hasura-migrations" migrate export
