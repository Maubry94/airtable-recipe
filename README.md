# ChefGPT

---

## Installation

### Prérequis

- [Docker](https://www.docker.com/) installé sur votre machine.

### Configuration

Dans chacun des dossiers suivants :

- `/vue`
- `/duplo`

Effectuez les opérations suivantes dans le dossier `/duplo` :

1. Copier le fichier `.env.local.example` :

   ```bash
   cp .env.local.example .env.local
   ```

2. Remplir les variables d’environnement dans le fichier ```.env.local```.

### Lancement du projet

```bash
cd airtable-recipe

docker compose up
```

### Accès à l'application

- Interface utilisateur (front-end) : <http://localhost:3000>.
- API (back-end Duplo) : <http://localhost:1506>.
