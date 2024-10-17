<h1>Grafika kompjuterike</h1>
<h2>CCS-601-2024</h1>

<b>Ligjërues:</b> Visar Shehu


Për të përdorur këtë repozitor, ju duhet që të njëjtin ta klononi në makinën tuaj:

```
git clone https://github.com/visarshehu/CCS-601-2024.git
```

Repozitori është i organizuar nëpër direktoriume, ku secili direktorium përfaqëson një javë specifike:

- Java I
- Java II
- Java III

Që ta ekzekutoni kodin, duhet të hyni në direktoriumin përkatës dhe të instaloni libraritë e nevojshme (vite dhe three). P.sh.:

```
cd "Java I"
npm install vite
npm install three
```

Pasi të keni instaluar vite, hapni fajllin package.json dhe kujdesuni që pjesa scripts ta ketë këtë përmbajtje:

```
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
```

Nëse gjithçka është në rregull, do të mund ta startoni projektin me:

```
npm run dev
```