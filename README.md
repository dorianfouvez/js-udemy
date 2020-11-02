                    ***Création du Repository***

1) Créer un dossier ou va se trouver le repo sur l'ordi perso
2) Initialiser le repo sur l'ordi perso (vérifier que vous etes dans le dossier au niveau du terminal(cd NomDuDossier)):
                    git init
3) Créer un repo sur GitHub ou GitLab
4) Lier les 2 repos:
                    git remote add origin https://gitnomdureprogit.git



                    ***Création server Express***
1) Installation globale du générateur d’applications :
                  npm i express-generator -g
2) Créer une app (par défault le nom est hello-world):
                  express --view=hbs NomDuDossierDuServer
3) Ajout de l'empechement du restart de nodemon pour les MAJ de .json dans package.json :
                   "nodemonConfig": {"ignore": ["data/*"]},
4) Ajout de la posibilité de run le serveur sous nodemon (qui restarst a chaque ctrl+s):
                    "dev": "nodemon ./bin/www",
5) Installation des dépendances (données dans le fichier package.json) (vérifier que vous etes dans le dossier "NomDuDossierDuServer" au niveau du terminal(cd NomDuDossier)):
                      npm install
6) Installer nodemon :
                    npm install -g nodemon



                    ***Run le serveur***
1) Soit en mode "normal" :
                    npm start
2) Soit en mode "dev" (restart à chaque "ctrl + s") :
                    npm run dev