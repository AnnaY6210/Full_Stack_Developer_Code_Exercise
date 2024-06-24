import 'graphql-import-node';
import { getGraphQLParameters, 
         processRequest, 
         Request, 
         renderGraphiQL, 
         shouldRenderGraphiQL, 
         sendResult } from "graphql-helix";
import { schema } from "./schema";
import { contextFactory } from "./context";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const express = require('express');
const server = express();
const router = express.Router();
const bodyParser = require('body-parser');

server.use(express.json());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

server.engine('html', require('ejs').renderFile);

router.get('/', (req: any, res: any) => {
  res.render('index.ejs')
})

router.get('/add-warehouse', (req: any, res: any) => {
  res.render('add-warehouse.ejs')
})

router.get('/add-shelf', async (req: any, res: any) => {
  let allWarehouses = await prisma.warehouse.findMany();
  res.render('add-shelf.ejs', {data: allWarehouses})
})

router.post('/create-shelf', async (req: any, res: any) => {
  console.log("Receiving data...")
  let body = req.body;
  let check = await prisma.shelf.findMany({
    where: {
      name: body.shelf
    }
  });
  if (check.length > 0) {
    res.redirect('/create-shelf');
    return;
  }
  console.log(body);
  let warehouse = await prisma.warehouse.findMany({
    where: {
      name: body.warehouse
    }
  });
  if (warehouse) {
    let zone = await prisma.zone.findMany({
      where: {
        warehouseId: warehouse[0].id,
        name: "Zone " + body.zone
      }
    })

    if (zone) {
      let newShelf = await prisma.shelf.create({
        data: {
          name: body.shelf,
          zoneId: zone[0].id
        }
      })
    }
  }
  res.send(body);
})

router.post('/create-warehouse', async (req: any, res: any) => {
  console.log("Receiving data...")
  let body = req.body;
  let check = await prisma.warehouse.findMany({
    where: {
      name: body.name
    }
  });
  if (check.length > 0) {
    res.redirect('/add-warehouse');
    return;
  }
  let newWarehouse = await prisma.warehouse.create({
    data: {
      name: body.name
    }
  })
  for (let i = 1; i <= 12; i++) {
    let newZone = await prisma.zone.create({
      data: {
        name: "Zone " + i,
        warehouseId: newWarehouse.id
      }
    })
  }
  res.send(newWarehouse);
})

server.use('/', router);
server.listen(process.env.port || 3000);
 
console.log('Running at http://localhost:3000');

/*

async function main() {
  
  
  server.route({
    method: ["POST", "GET"],
    url: "/graphql",
    handler: async (req, reply) => {
      const request: Request = {
        headers: req.headers,
        method: req.method,
        query: req.query,
        body: req.body,
      };

      if (shouldRenderGraphiQL(request)) {
        reply.header("Content-Type", "text/html");
        reply.send(
          renderGraphiQL({
            endpoint: "/graphql",
          })
        );

        return;
      }

      const { operationName, query, variables } = getGraphQLParameters(request);

      const result = await processRequest({
        request,
        schema,
        operationName,
        contextFactory,
        query,
        variables,
      });

      sendResult(result, reply.raw);
    }
  });

  server.listen(3000, "0.0.0.0", () => {
    console.log(`This is now running http://localhost:3000`);
  });
}

main();
*/