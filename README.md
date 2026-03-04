# EPFlix - Guide d'Installation et de Lancement

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** (v24.0.0 ou ^20.19.0 ou ^22.12.0) - [Télécharger](https://nodejs.org/)
- **npm** (v10+, installé avec Node.js)
- **Git** - [Télécharger](https://git-scm.com/)
- **Docker** et **Docker Compose** - [Télécharger](https://www.docker.com/)

Vérifiez les versions :
```bash
node --version
npm --version
git --version
docker --version
docker-compose --version
```

Assurez-vous que Node.js est en version compatible :
```bash
node --version
# Doit afficher v24.0.0 ou v20.19.0+ ou v22.12.0+
```

---

## 🚀 Étapes d'Installation

### **PARTIE 1 : BACKEND (Angular Lab)**

#### **1.1 Cloner le Repository Backend**
```bash
git clone https://gitlab.takima.io/school/formation-angular/angular-lab.git
cd angular-lab
```

#### **1.2 Lancer le Backend avec Docker Compose**

Dans le dossier `angular-lab` :
```bash
docker-compose up
```

Cela va :
- Télécharger/construire l'image Docker
- Lancer le service backend sur `http://localhost:8080`
- Afficher les logs dans le terminal

⏳ **Attendez** que le message `Server running on port 8080` apparaisse.

Pour vérifier que le backend est actif :
```bash
curl http://localhost:8080
```

Vous devriez recevoir une réponse du serveur.

⚠️ **Gardez ce terminal ouvert avec docker-compose en cours d'exécution**


### **PARTIE 2 : FRONTEND (EPFlix)**

#### **2.1 Cloner le Repository Frontend**

Dans un **nouveau terminal** (ne fermez pas celui du backend) :
```bash
git clone <git@github.com:nehadyasmine-creator/EPFlix.git>
cd EPFlix
```

#### **2.2 Installer Angular CLI Globalement**
```bash
npm install -g @angular/cli@20
```

Vérifiez l'installation :
```bash
ng version
```

Cela doit afficher `@angular/cli: 20.x.x`

---

#### **2.3 Installer les Dépendances du Projet**

Assurez-vous d'être dans le dossier `EPFlix`, puis installez chaque librairie manuellement :

**Bootstrap & Icons :**
```bash
npm install bootstrap@5.3.3
npm install bootstrap-icons@^1.13.1
```

**Graphiques & Visualisations :**
```bash
npm install chart.js@^4.5.1
npm install recharts@^3.7.0
```

**Utilitaires & Dépendances Core :**
```bash
npm install rxjs@~7.8.0
npm install swiper@^12.1.2
npm install tslib@^2.3.0
npm install zone.js@~0.15.0
```

**Alternative - Installer tout d'un coup :**
```bash
npm install bootstrap@5.3.3 bootstrap-icons@^1.13.1 chart.js@^4.5.1 recharts@^3.7.0 rxjs@~7.8.0 swiper@^12.1.2 tslib@^2.3.0 zone.js@~0.15.0
```

#### **Dépendances Expliquées :**

| Librairie | Version | Description |
|-----------|---------|-------------|
| `bootstrap` | 5.3.3 | Framework CSS pour le styling |
| `bootstrap-icons` | 1.13.1 | Icônes (navicons, boutons, etc.) |
| `chart.js` | 4.5.1 | Graphiques (dashboard admin) |
| `recharts` | 3.7.0 | Composants graphiques réactifs |
| `rxjs` | 7.8.0 | Programmation réactive (observables) |
| `swiper` | 12.1.2 | Carrousel hero section |
| `tslib` | 2.3.0 | Utilitaires TypeScript |
| `zone.js` | 0.15.0 | Zone.js pour Angular (gestion des zones) |

Vérifiez que tout s'est installé correctement :
```bash
npm list
```

---

#### **2.4 Lancer le Serveur de Développement Angular**

Dans un **nouveau terminal** (avec docker-compose et backend actifs) :
```bash
ng serve
```

Cela va :
- Compiler le projet Angular
- Lancer le serveur de développement sur `http://localhost:4200`
- Surveiller les changements de fichiers (hot reload)

⏳ **Attendez** que vous voyiez :
```
✔ Compiled successfully
✔ Development Server is running on http://localhost:4200
```

---

## 🌐 Accéder à l'Application

Une fois que `ng serve` affiche le message de compilation réussie :

1. Ouvrez votre navigateur
2. Allez à : **http://localhost:4200**
3. L'application EPFlix doit charger

---

## 📊 État des Terminaux

À ce stade, vous devez avoir **3 terminaux ouverts** :

| Terminal | Commande | Port | État |
|----------|----------|------|------|
| 1 | `docker-compose up` (dans angular-lab) | 8080 | Backend actif |
| 2 | `ng serve` (dans EPFlix) | 4200 | Frontend actif |
| 3 | Libre pour autres commandes | - | Disponible |

---

## 🔧 Commandes Utiles

### **Arrêter les Services**

**Arrêter le backend Docker :**
```bash
# Dans le terminal docker-compose
Ctrl + C
```

**Arrêter le serveur Angular :**
```bash
# Dans le terminal ng serve
Ctrl + C
```

**Arrêter complètement Docker :**
```bash
docker-compose down
```

### **Réinstaller les Dépendances**

Si vous avez des erreurs de dépendances :
```bash
rm -rf node_modules package-lock.json
npm install bootstrap@5.3.3 bootstrap-icons@^1.13.1 chart.js@^4.5.1 recharts@^3.7.0 rxjs@~7.8.0 swiper@^12.1.2 tslib@^2.3.0 zone.js@~0.15.0
```

### **Nettoyer le Cache Angular**
```bash
rm -rf .angular/cache
ng build
```

### **Vérifier la Compilation**

Pour tester la compilation sans serveur :
```bash
ng build
```

---

## 📝 Structure du Projet
```
EPFlix/
├── src/
│   ├── app/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/          # Pages principales
│   │   ├── services/       # Services API
│   │   ├── models/         # Modèles TypeScript
│   │   └── app.component.* # Composant racine
│   ├── styles.scss         # Styles globaux + dark mode
│   └── main.ts            # Point d'entrée
├── package.json           # Dépendances npm
└── angular.json          # Configuration Angular

angular-lab/
├── docker-compose.yml      # Configuration Docker
└── ... (Backend Angular Lab)
```

---

## 🎨 Configuration API

Le frontend est configuré pour communiquer avec le backend sur :
```
http://localhost:8080
```

Assurez-vous que les deux services sont actifs pour que l'application fonctionne complètement.

---

## 🐛 Dépannage

### **Erreurs de compilation Angular**
```bash
# Nettoyez et réinstallez
rm -rf node_modules package-lock.json .angular/cache
npm install bootstrap@5.3.3 bootstrap-icons@^1.13.1 chart.js@^4.5.1 recharts@^3.7.0 rxjs@~7.8.0 swiper@^12.1.2 tslib@^2.3.0 zone.js@~0.15.0
ng serve
```

### **Docker ne démarre pas**
```bash
# Vérifiez que Docker Desktop est lancé
docker ps

# Reconstruisez l'image
docker-compose down
docker-compose up --build
```

### **Librairie non trouvée**
Vérifiez que la librairie est listée dans `package.json` :
```bash
npm list bootstrap
npm list bootstrap-icons
# etc.
```

## ✅ Vérification Complète

Checklist pour vérifier que tout fonctionne :

- [ ] `node --version` affiche v24.0.0, v20.19.0+ ou v22.12.0+
- [ ] `npm --version` affiche v10+
- [ ] `ng version` affiche @angular/cli 20.x
- [ ] Backend : `docker-compose up` lance sans erreur
- [ ] Backend : `curl http://localhost:8080` répond
- [ ] Frontend : `npm list` affiche toutes les dépendances
- [ ] Frontend : `ng serve` compile sans erreur
- [ ] Frontend : http://localhost:4200 charge l'app
- [ ] Dark mode toggle fonctionne
- [ ] Vous pouvez naviguer entre les pages
- [ ] Les commentaires se chargent (backend actif)

## 📞 Support

Pour toute erreur :
1. Vérifiez les versions des outils
2. Assurez-vous que docker-compose et ng serve sont tous les deux actifs
3. Nettoyez et réinstallez : `rm -rf node_modules && npm install bootstrap@5.3.3 bootstrap-icons@^1.13.1 chart.js@^4.5.1 recharts@^3.7.0 rxjs@~7.8.0 swiper@^12.1.2 tslib@^2.3.0 zone.js@~0.15.0`
4. Vérifiez que les ports 4200 et 8080 ne sont pas bloqués

**Bonne chance ! 🚀**