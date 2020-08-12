# Set up

First you download the files
```
git clone https://github.com/fipaniagua/chilean-hydroelectric-system-vis
```

Navigate to the project folder

```
cd 'chilean-hydroelectric-system-vis/app'
```
and run a simple python server

```
python -m SimpleHTTPServer 8000
```

for windows

```
python -m http.server 8000
```

then you can access the app in any browser at  http://localhost:8000

# Folders & Files

### python script
this folder contain a script that process the plp file and the dbf database. Then create a json file that is used un the web app

### app
in this folder is located the web app

### app/Js
In this folder are located the javascript libraries (d3.js + dc.js + leaflet + dc.leaflet.js) needed to run the application. The file charts.js contains the main program

### app/Css
This folder containd the css files that the used libraries require.
