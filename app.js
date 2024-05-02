const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Watchlist = require("./models/watchlist");
const Portfolio = require("./models/portfolio");
const Wallet = require("./models/wallet");
const { format, subDays } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');


const app = express();
app.use(cors({ origin: "*" }));

// connect to db
const dbURI =
  "mongodb+srv://pprajapa:Parth2803@cluster0.occjvfy.mongodb.net/stockDB?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(dbURI)
  .then((result) => console.log("connected to db"))
  .catch((err) => console.log(err));

const port = 5000;



const API_TOKEN = "cn0452pr01qkcvkfnabgcn0452pr01qkcvkfnac0";

app.get("/search", async (req, res) => {
  let symbol = req.query.symbol
  symbol = symbol.toUpperCase();
  // symbol = "TSLA";
  // console.log(symbol)
  apiKey = `https://finnhub.io/api/v1/search?q=${symbol}&token=${API_TOKEN}`;
  let response = await fetch(apiKey);
  let data = await response.json();
  // console.log("data:", data)
  res.json(data);
});

app.get("/stockdetails", async (req, res) => {
  let symbol = req.query.symbol;
  symbol = symbol.toUpperCase();
  // symbol = "TSLA"
  // console.log("rest1", symbol);
  apiKey = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_TOKEN}`;
  let response = await fetch(apiKey);
  let data = await response.json();
  // console.log(data)
  res.json(data);
});

app.get("/stockquote", async (req, res) => {
  let symbol = req.query.symbol;
  // console.log(symbol)
  symbol = symbol.toUpperCase();
  // console.log(symbol)
  apiKey = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_TOKEN}`;
  let response = await fetch(apiKey);
  let data = await response.json();
  // console.log(data)
  res.json(data);
});

app.get("/peers", async (req, res) => {
  let symbol = req.query.symbol;
  symbol = symbol.toUpperCase();
  // console.log(symbol)
  apiKey = `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${API_TOKEN}`;
  let response = await fetch(apiKey);
  let data = await response.json();
  // console.log(data)
  res.json(data);
});

app.get("/companynews", async (req, res) => {
  let symbol = req.query.symbol;
  symbol = symbol.toUpperCase();
  // console.log(symbol)
  const currentDate = new Date();

  const moment = require("moment-timezone");

  // Current time
  const isoString = currentDate.toISOString();
  const pstDate = moment(isoString)
    .tz("America/Los_Angeles")
    .format("YYYY-MM-DD HH:mm:ss");
  // console.log("Current: ", pstDate);
  const momentObj = moment(pstDate, "YYYY-MM-DD HH:mm:ss");
  let dateOnly = momentObj.format("YYYY-MM-DD");
  dateOnly = dateOnly.trim();
  // console.log("Current Date: ", dateOnly)

  // One week before
  const momentObj1 = moment(pstDate, "YYYY-MM-DD HH:mm:ss");
  const oneWeekBeforeDate = momentObj1.clone().subtract(7, "days");
  let oneWeekBeforeDateOnly = oneWeekBeforeDate.format("YYYY-MM-DD");
  oneWeekBeforeDateOnly = oneWeekBeforeDateOnly.trim();
  // console.log("One Week Before Date in PST: ", oneWeekBeforeDateOnly);

  apiKey = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${oneWeekBeforeDateOnly}&to=${dateOnly}&token=${API_TOKEN}`;
  let response = await fetch(apiKey);
  let data = await response.json();
  // console.log(data)
  res.json(data);
});

app.get('/stocksummarychart', async (req, res) => {
  let symbol = req.query.symbol
  symbol = symbol.toUpperCase();
  // let symbol = "AAPL"

  // symbol = symbol.toUpperCase();
  // console.log(symbol)
  let apiKeystockquote = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_TOKEN}`;
  let response1 = await fetch(apiKeystockquote);
  let data1 = await response1.json();
  
  const t = data1["t"];
  const marketTime = new Date(t * 1000);
  const marketTimeInLA = moment(marketTime, 'America/Los_Angeles');
  const from_date = marketTimeInLA.subtract(1, 'days').format("YYYY-MM-DD");

  // const from_date = format(subDays(marketTime, 1),"yyyy-MM-dd")
  const today = moment().format('YYYY-MM-DD');
  let sqapiKey = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/hour/${from_date}/${today}?adjusted=true&sort=asc&apiKey=Bg8FUNVpPiSJxHvC1XprO0O6IqRLDz1G`
  let response = await fetch(sqapiKey)
  let data = await response.json();
  // console.log(data)
  res.json(data)
})

app.get("/charts", async (req, res) => {
  let symbol = req.query.symbol
  symbol = symbol.toUpperCase();
  // let symbol = "AAPL";

  // console.log(symbol)
  const moment = require("moment");

  const currentDate = moment();
  const twoYearsBefore = moment().subtract(2, "years");
  const formattedCurrentDate = currentDate.format("YYYY-MM-DD");
  const formattedTwoYearsBefore = twoYearsBefore.format("YYYY-MM-DD");

  // console.log("Current Date:", formattedCurrentDate);
  // console.log("Two Years Before:", formattedTwoYearsBefore);
  apiKey = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${formattedTwoYearsBefore}/${formattedCurrentDate}?adjusted=true&sort=asc&apiKey=Bg8FUNVpPiSJxHvC1XprO0O6IqRLDz1G`;
  let response = await fetch(apiKey);
  let data = await response.json();
  // console.log(data)
  res.json(data);
});

app.get("/insider", async (req, res) => {
  let symbol = req.query.symbol;
  // let symbol = "AAPL"
  symbol = symbol.toUpperCase();
  // console.log(symbol)
  apiKey = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=2022-01-01&token=${API_TOKEN}`;
  let response = await fetch(apiKey);
  let data = await response.json();
  // console.log(data)
  res.json(data);
});

//finnhub.io/api/v1/stock/earnings?symbol=<TICKER>&token=<API_KEY

app.get("/companyearnings", async (req, res) => {
  let symbol = req.query.symbol;
  // let symbol = "AAPL"
  symbol = symbol.toUpperCase();
  // console.log(symbol)
  apiKey = `https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=${API_TOKEN}`;
  let response = await fetch(apiKey);
  let data = await response.json();
  // console.log(data)
  res.json(data);
});

app.get("/recommendation", async (req, res) => {
  let symbol = req.query.symbol;
  // let symbol = "AAPL"
  symbol = symbol.toUpperCase();
  // console.log(symbol)
  apiKey = `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${API_TOKEN}`;
  let response = await fetch(apiKey);
  let data = await response.json();
  // console.log(data)
  res.json(data);
});

app.get("/add-watchlist", (req, res) => {
  let tick = req.query.ticker;
  let n = req.query.name;
  // console.log(tick);
  // console.log(n);

  const watchlist = new Watchlist({
    ticker: tick,
    name: n,
  });

  watchlist
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/watchlist1", (req, res) => {
  Watchlist.find()
    .then(async (result) => {
      let final = [];
      for (let i = 0; i < result.length; i++) {
        const t = result[i]["ticker"];
        const n = result[i]["name"];
        // [{t:10,n,c,d,dp}, [t,n,c,d,dp]]
        // console.log("t", t)
        apiKey = `https://finnhub.io/api/v1/quote?symbol=${t}&token=${API_TOKEN}`;
        let response = await fetch(apiKey);
        let data1 = await response.json();
        // console.log("data1: ", data1)
        // console.log("c: ",data1['c'])
        const c = data1["c"];
        const d = data1["d"];
        const dp = data1["dp"];
        let finaldata = { t: t, n: n, c: c, d: d, dp: dp };
        final.push(finaldata);
      }
      // console.log("temp:" ,final)

      res.json(final);
      // console.log(result)
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/delete-watchlist", (req, res) => {
  let symbol = req.query.symbol;
  symbol = symbol.toUpperCase();
  // console.log("SYm: ", symbol)
  Watchlist.findOneAndDelete({ ticker: symbol }).then((data) => {
    // console.log("print data: ", data);
    res.json(data)
  });
  // res.json({ message: "Deleted Successfully" });
});

app.get("/search-watchlist", (req, res) => {
  let symbol = req.query.symbol;
  symbol = symbol.toUpperCase();
  // console.log("SYm: ", symbol)
  Watchlist.findOne({ ticker: symbol }).then((data) => {
    let isdata = false;
    if (data !== null){
      isdata = true;
    }
    res.json(isdata);
    // console.log("print data: ", isdata);
  });
  
});

app.get("/add-portfolio", (req, res) => {
  let tick = req.query.ticker;
  let n = req.query.name;
  let q = parseFloat(req.query.quantity);
  let t = parseFloat(req.query.total);
  // console.log("backend port: ", tick, n, q, t)
  Portfolio.updateOne(
    { ticker: tick },
    { ticker: tick, $inc: { quantity: q, total: t }, name: n },
    { upsert: true }
  )
    .then((result) => {
      res.send(result);
      // console.log("portfolio added: ", result)
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/portfolio1", (req, res) => {
  Portfolio.find()
    .then(async (result) => {
      let final = [];
      for (let i = 0; i < result.length; i++) {
        const tick = result[i]["ticker"];
        const n = result[i]["name"];
        const q = result[i]["quantity"];
        const t = result[i]["total"];
       
        // console.log("ticker", tick)
        apiKey = `https://finnhub.io/api/v1/quote?symbol=${tick}&token=${API_TOKEN}`;
        let response = await fetch(apiKey);
        let data1 = await response.json();
        // console.log("data1: ", data1)
        // console.log("c: ",data1['c'])
        const c = data1["c"];
        // console.log("c:", c)

        let finaldata = { ticker: tick, name: n, c: c, quantity: q, total: t };
        final.push(finaldata);
      }
      // console.log("temp:" ,final)

      res.json(final);
      // console.log(result)
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/sell-portfolio", (req, res) => {
  let tick = req.query.ticker;
  let n = req.query.name;
  let q = parseFloat(req.query.quantity);
  let t = parseFloat(req.query.total);
  // console.log("q", q)
  Portfolio.findOne({ ticker: tick })
  .then((result) => {
    // console.log('this is the result', result);
    // console.log('quantity', q);
    // console.log('quantity + 1', q + 1)
    if (result["quantity"] === q){
      Portfolio.findOneAndDelete({ ticker: tick }).then((r) => {
        console.log('this is r', r);
        res.json(result);
        return
      })
      // console.log("Deleted")
      
      
    }
    else{
      console.log("result sell: ", result["quantity"], q)
      Portfolio.findOneAndUpdate(
        { ticker: tick },
        {quantity: result["quantity"] - q, total: result["total"] -t  }
       
      ).then((r) => {
        console.log('this is r update', r);
        res.json(result);
      })
      
      
      
      // console.log("UPDATED")

      return
    }
  })
})
  
      


app.get("/add-wallet", (req, res) => {
  let t = Number(req.query.total);
  // console.log("total: ", t);

  Wallet.updateOne(
    { _id: '660612bb871d45c52ee2fe8c' },
    { $inc: { wallet: t } },
    { upsert: true }
  )
    .then((result) => {
      res.send(result);
      // console.log("Wallet add:", result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/wallet", (req, res) => {
  Wallet.findOne()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/subtract-wallet", (req, res) => {
  let t = parseFloat(req.query.total);
  // console.log("total: ", t);
  Wallet.updateOne(
    { _id: "660612bb871d45c52ee2fe8c" },
    { $inc: { wallet: -t } },
    { upsert: true }
  )
    .then((result) => {
      res.send(result);
      // console.log("Wallet subtract:", result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
