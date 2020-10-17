const express = require("express");
const router = new express.Router();
const request = require("request");

router.get("/", (req, res) => {
  res.render("home", {});
});

router.get("/enter", (req, res) => {
  res.render("enter", {});
});

const config = require("config");
const api_key = config.api_key;
const list_id = config.list_id;

router.post("/contact", (req, res) => {
  const { name, contact, email } = req.body;

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: "unsubscribed",
        merge_fields: {
          FNAME: name,
          PHONE: contact,
        },
      },
    ],
  };

  const postData = JSON.stringify(data);

  const options = {
    url: `https://us4.api.mailchimp.com/3.0/lists/${list_id}`,
    method: "POST",
    headers: {
      Authorization: `auth ${api_key}`,
    },
    body: postData,
  };

  request(options, (err, response, body) => {
    // if (err) {
    //   res.redirect("/failure");
    // } else {
    //   if (response.statusCode === 200) {
    //     res.redirect("/success");
    //   } else {
    //     res.redirect("/failure");
    //   }
    // }
    res.redirect("/");
  });
});

// router.get("/success", (req, res) => {
//   res.render("success", {});
// });

// router.get("/failure", (req, res) => {
//   res.render("failure", {});
// });

module.exports = router;
