
# make sure to install git, node, npm , latest python, only then follow these instructions  
  
git clone [https://github.com/shivi111104/pywiz.git]  
cd pywiz/frontend  
npm install   
cd ../backend   
pip install pipenv   
cd ../    
npm install    
npm start    

development should start with a white screen on localhost:3000 and a memlist on localhost:5000

# if you are working separately on backend dependencies

cd backend     
pipenv shell   
[run all tests, commands etc etc wtv]  
pipenv lock   
exit  
