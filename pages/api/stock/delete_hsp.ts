import { PrismaClient } from "@prisma/client"

let prisma

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }

  prisma = global.prisma
}

export default async (req, res) => {

    if (req.method === "POST"){

        var ticker_symbol, stock_id;

        // check if ticker symbol exists in body
        if(!req.body.ticker_symbol){
            const errorMsg = "ticker_symbol Null or undefined";
            console.error(errorMsg);
            res.status(406).json({"message" : errorMsg});
            return
        }

        // check if ticker symbol exists in Stock database
        try{
            ticker_symbol = req.body.ticker_symbol;
            
            const stock_record = await prisma.stock.findFirst({
                where:{
                    tickerSymbol : ticker_symbol
                }
            })

            // return the corresponding stockID
            stock_id = stock_record.stockID

        } catch (error) {
            const errorMsg = error.message;
            console.error(errorMsg)
            res.status(406).json({"message" : errorMsg});
            return
        }

        try{
            // delete the HSP for the ticker_symbol
            const delete_hsp_results = await prisma.historical_Stock_Price.deleteMany({
                where:{
                    stockID : stock_id
                }
            })

            const successMsg = `Deleted ${delete_hsp_results.count} records for ${ticker_symbol}`
            console.log(successMsg)
            res.status(200).json({"message" : successMsg});

        } catch (error) {
            const errorMsg = error.message;
            console.error(errorMsg)
            res.status(406).json({"message" : errorMsg});
        }
       
    } else {
        res.status(406).json({"message": `ERROR: ${req.method} method used; this endpoint only accepts POST methods`});
    }
    

}