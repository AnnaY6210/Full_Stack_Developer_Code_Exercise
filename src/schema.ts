import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLContext } from "./context";
import typeDefs from "./schema.graphql";
import { Warehouse,
         Zone } from "@prisma/client";

const resolvers = {
    Query: {
      checkWarehouses: async (parent: unknown, args: {}, context: GraphQLContext) => {
        return context.prisma.warehouse.findMany();
      },
    },
    Warehouse: {
        id: (parent: Warehouse) => parent.id,
        name: (parent: Warehouse) => parent.name
    },
    Zone: {
        id: (parent: Zone) => parent.id,
        warehouseId: (parent: Zone) => parent.id,
        name: (parent: Zone) => parent.name
    },
    Mutation: {
      createWarehouse: (
        parent: unknown,
        args: { name: string },
        context: GraphQLContext
      ) => {
        const newWarehouse = context.prisma.warehouse.create({
            data: {
                name: args.name,
            }
        })
        return newWarehouse;
      },
    },
  };

/*
type Warehouse = {
    id: string;
    name: string;
    zones: Array<Zone>;
};

type Zone = {
    id: string;
    warehouse: Warehouse;
    name: string;
    shelves: Array<Shelf>;
};

type Shelf = {
    id: string;
    zone: Zone;
    name: string;
    items: Array<Item>;
};

type Item = {
    id: string;
    shelf: Shelf;
    name: string;
};

const warehouses: Warehouse[] = [];

const zones: Zone[] = [];

function createZone (warehouse_name: Warehouse, num: number) {
    let idCount = zones.length;

    const zone: Zone = {
        id: `zone-${idCount++}`,
        name: "Zone " + num,
        warehouse: warehouse_name,
        shelves: []
    }

    zones.push(zone)
    return zone
}

const resolvers = {
    Query: {
        checkWarehouses: () => warehouses
    },
    Warehouse: {
        id: (parent: Warehouse) => parent.id,
        name: (parent: Warehouse) => parent.name,
        zones: (parent: Warehouse) => parent.zones
    },
    Zone: {
        id: (parent: Zone) => parent.id,
        warehouse: (parent: Zone) => parent.warehouse,
        name: (parent: Zone) => parent.name,
        shelves: (parent: Zone) => parent.shelves
    },
    Mutation: {
        createWarehouse: (parent: unknown, args: { name: string }) => {
            let idCount = warehouses.length;

            const warehouse: Warehouse = {
            id: `warehouse-${idCount++}`,
            name: args.name,
            zones: [],
            };

            for (let i = 1; i <= 12; i++) {
                let zone = createZone(warehouse, i);
                warehouse.zones.push(zone);
            }

            warehouses.push(warehouse);

            return warehouse;
        },
    },
}
*/

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
