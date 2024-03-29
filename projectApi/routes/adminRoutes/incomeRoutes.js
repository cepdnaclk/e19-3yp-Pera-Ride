const Income = require("../../models/Income");
const router = require("express").Router();

// create income
router.post("/create/income", async (req, res) => {
  const incomeValue = req.body.amount;
  const slipPostedDate = req.body.paymentDate;
  const userId = req.body.userID;
  const slipPostedObj = new Date(slipPostedDate);
  // console.log(slipPostedObj);
  // console.log(typeof slipPostedObj);
  if (!incomeValue || !slipPostedDate || !userId) {
    return res
      .status(400)
      .json("Income Value, slip posted date and posted user ID Required!");
  }

  try {
    const newIncome = new Income({
      amount: incomeValue,
      paymentDate: slipPostedObj,
      userID: userId,
    });
    const savedAmount = await newIncome.save();
    res.status(201).json(savedAmount);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get income status
// router.get("/income/status", async (req, res) => {
//   const date = new Date();
//   const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

//   try {
//     const data = await Income.aggregate([
//       { $match: { paymentDate: { $gte: lastYear } } },
//       {
//         $project: {
//           month: { $month: "$paymentDate" },
//         },
//       },
//       {
//         $group: {
//           _id: "$month",
//           total: { $sum: 1 },
//         },
//       },
//     ]);
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// total income over the year
router.get("/income/status", async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    const data = await Income.aggregate([
      {
        $match: { paymentDate: { $gte: lastYear } },
      },
      {
        $project: {
          month: { $month: "$paymentDate" },
          amount: 1, // include the amount field in the projection
        },
      },
      {
        $group: {
          _id: "$month",
          label: {
            $first: { $arrayElemAt: [months, { $subtract: ["$month", 1] }] },
          },
          total: { $sum: "$amount" }, // calculate the sum of amount per month
        },
      },
      {
        $sort: { _id: 1 }, // Sort by id in ascending order
      },
      {
        $project: {
          id: "$_id", // Rename _id to id
          _id: 0, // Exclude _id field
          month: "$label",
          income: { $toString: "$total" },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get total complete income
router.get("/total/income", async (req, res) => {
  try {
    const foundIncomes = await Income.find();
    if (!foundIncomes) {
      return res.status(404).json("No income yet!");
    }

    let fullIncome = 0;

    for (let obj of foundIncomes) {
      fullIncome = fullIncome + parseFloat(obj.amount);
    }

    res.status(200).json(fullIncome);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
