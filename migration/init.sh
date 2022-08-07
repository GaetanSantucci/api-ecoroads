export PGUSER=postgres

#* 1 - Création d'un utilisateur en BDD (with login)
createuser -l -P ecoroads
# #revient a faire CREATE USER ecoRoads WITH PASSWORD ecoRoads;

# #* 2 - Création d'une BDD ainsi que le propriétaire
createdb -O ecoroads ecoroads
# #revient a faire CREATE DATABASE OWNER ecoRoads;

# #* 3 - Initialiser Sqitch
sqitch init ecoroads --engine pg

#* 4 - Création d'une version 1 pour la BDD
sqitch add 01.init -n "create tables"
sqitch add 02.add_table_brand -n "modification table car and add table brand"
sqitch add 03.new_constraint_delete_on_cascade -n "delete constraints on table user_like_category"
sqitch add 04.add_table_team -n "add table team"

#* 5 - Initialiser Sqitch dans le terminal
#sh init.sh
#Saisir le mot de passe pour le nouveau rôle : mot de passe pour le nouveau rôle
#Saisir le mot de passe à nouveau : confirmation du mot de passe pour le nouveau rôle
#Mot de passe : mot de passe pour la connection PGUSER
#Mot de passe : mot de passe pour la connection PGUSER\