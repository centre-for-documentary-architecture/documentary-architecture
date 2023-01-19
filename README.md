# CDA Archive Website

- https://trello.com/b/2xUb6YXK/cda-website-v2

# Install
```
git clone git@github.com:centre-for-documentary-architecture/documentary-architecture.git

# download `content` and `storage/accounts` folders from ftp

composer install

sass --watch --style=compressed assets/scss:assets/css

cd assets/frontend/app
npm install
```

# Develop
```
cd assets/frontend/app
npm run dev
```









## Web APIs
The website offeres some public APIs

- To get a JSON representation of the currently viewed page, just append `.json` to the url.
- To get a list of all Liebling-House Tours and Tourstops and all 3D-world-linked elements, call

```
/i/liebling-house/worlditems.json
```
