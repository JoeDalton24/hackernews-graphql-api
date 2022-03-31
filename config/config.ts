import doten from "dotenv";
doten.config();

const {PORT,ACCES_TOKEN}=process.env
 
export{
PORT,
ACCES_TOKEN
}