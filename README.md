# Nexus - Networking with Data-Driven Surveys

### Demo Video
https://github.com/manavendrasen/nexus/assets/26283488/6681384d-e10f-4a4c-99a1-45ec5cef77ba

Blog - [Nexus - Networking with Data-Driven Surveys](https://blog.manavendrasen.com/nexus-networking-with-data-driven-serveys)

## Development
### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deploy the python function
```
	cd plot-function
	
	docker build -t nexus-numpy-sklearn .
	
	docker tag nexus-numpy-sklearn:latest <your_ecr>/nexus-numpy-sklearn:latest
	
	docker push <your_ecr>/nexus-numpy-sklearn:latest
```
