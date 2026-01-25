## How to setup a new Typescript Express project

```
npm init -y
```

```
npm install -D typescript
npm i concurrently
```

```
npx tsc --init 
```

```
Add the following scripts in package.json

{
    "build": "npx tsc",
    "watch": "npx tsc -w",
    "prestart": "npm run build",
    "start": "npx nodemon dist/index.js",
    "dev": "npx concurrently --kill-others \"npm run watch\" \"npm start\""
}
```


```
npm run dev
```



