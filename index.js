const JSONStream = require("JSONStream");
const es = require("event-stream");
const fs = require("fs");
const args = process.argv.slice(2);

var total_items = 0;
var all_data = [];

fs.createReadStream(args[0])
  .pipe(JSONStream.parse("BrandedFoods.*"))
  .pipe(
    es.mapSync((item) => {
      //console.error(item);
      total_items++;

      let obj = {};

      obj.brand = item.brandOwner;
      obj.upc = item.gtinUpc;
      obj.description = item.description;
      obj.country = item.marketCountry;
      obj.label_nutrients = [];

      Object.entries(item.labelNutrients).forEach((key, val) => {
        let ln_obj = {
          name: key,
          value: val.value,
        };

        obj.label_nutrients.push(ln_obj);
      });

      obj.nutrients = [];

      item.foodNutrients.forEach((fni) => {
        let fni_obj = {
          name: fni.nutrient.name,
          unit: fni.nutrient.unitName,
          amount: fni.amount,
          derivation: fni.foodNutrientDerivation.description,
          source: fni.foodNutrientDerivation.foodNutrientSource.description,
        };

        obj.nutrients.push(fni_obj);
      });

      obj.serving_size = item.servingSize;
      obj.serving_size_unit = item.servingSizeUnit;
      obj.category = item.brandedFoodCategory;
      obj.created = item.availableDate;
      obj.fdc_id = item.fdcId;

      //console.log(`Done: ${obj.description}`);

      return all_data.push(obj);
    })
  )
  .on("end", () => {
    console.log("Done reading.");
    console.log(total_items);

    fs.writeFileSync(args[0].split("/")[1], JSON.stringify(all_data), (err) => {
      if (err) throw err;
      console.log("Data written to file.");
    });
  });
