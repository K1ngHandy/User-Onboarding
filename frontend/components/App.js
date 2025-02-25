// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";

const initialFormValues = {
  username: "",
  favLanguage: "",
  favFood: "",
  agreement: false,
};
const e = {
  // This is a dictionary of validation error messages.
  // username
  usernameRequired: "username is required",
  usernameMin: "username must be at least 3 characters",
  usernameMax: "username cannot exceed 20 characters",
  // favLanguage
  favLanguageRequired: "favLanguage is required",
  favLanguageOptions: "favLanguage must be either javascript or rust",
  // favFood
  favFoodRequired: "favFood is required",
  favFoodOptions: "favFood must be either broccoli, spaghetti or pizza",
  // agreement
  agreementRequired: "agreement is required",
  agreementOptions: "agreement must be accepted",
};

const initialDisabled = true;

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const schema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required(e.usernameRequired)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favLanguage: yup
    .string()
    .oneOf(["rust", "javascript"], e.favLanguageOptions)
    .required(e.favLanguageRequired),
  favFood: yup
    .string()
    .oneOf(["pizza", "spaghetti", "broccoli"], e.favFoodOptions)
    .required(e.favFoodRequired),
  agreement: yup
    .boolean()
    .oneOf([true], e.agreementOptions)
    .required(e.agreementRequired),
});

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [formValues, setFormValues] = useState(initialFormValues);
  const [success, setSuccess] = useState("");
  const [failure, setFailure] = useState("");
  const [disabled, setDisabled] = useState(initialDisabled);

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  useEffect(() => {
    schema.isValid(formValues).then((valid) => setDisabled(!valid));
  }, [formValues]);

  const validate = (name, value) => {
    yup
      .reach(schema, name)
      .validate(value)
      .then(() => setFailure({ ...failure, [name]: "" }))
      .catch((err) => setFailure({ ...failure, [name]: err.errors[0] }));
  };

  const onChange = (evt) => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    const { name, type, value, checked } = evt.target;
    const newValue = type === "checkbox" ? checked : value;

    validate(name, newValue);
    setFormValues({ ...formValues, [name]: newValue });
  };

  const onSubmit = (evt) => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault();
    const newUser = {
      username: formValues.username,
      favLanguage: formValues.favLanguage,
      favFood: formValues.favFood,
      agreement: formValues.agreement,
    };
    axios
      .post("https://webapis.bloomtechdev.com/registration", newUser)
      .then(() => {
        setSuccess("Success! Welcome, new user!");
        setFailure("");
        setFormValues(initialFormValues);
      })
      .catch((err) => {
        setFailure(err || { username: "Sorry! Username is taken" });
      })
      .finally(() => setFormValues(initialFormValues));
  };

  return (
    <div>
      {" "}
      {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {success && <h4 className="success">{success}</h4>}
        {/* {failure && <h4 className="error">Sorry! Username is taken</h4>} */}
        {/* need to see endpoint data for username check */}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Type Username"
            onChange={onChange}
          />
          {failure.username && (
            <div className="validation">{failure.username}</div>
          )}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input
                type="radio"
                name="favLanguage"
                value="javascript"
                onChange={onChange}
                checked={formValues.favLanguage === "javascript"}
              />
              JavaScript
            </label>
            <label>
              <input
                type="radio"
                name="favLanguage"
                value="rust"
                onChange={onChange}
                checked={formValues.favLanguage === "rust"}
              />
              Rust
            </label>
          </fieldset>
          {failure.favLanguage && (
            <div className="validation">{failure.favLanguage}</div>
          )}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" onChange={onChange}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {failure.favFood && (
            <div className="validation">{failure.favFood}</div>
          )}
        </div>

        <div className="inputGroup">
          <label>
            <input
              id="agreement"
              type="checkbox"
              name="agreement"
              onChange={onChange}
            />
            Agree to our terms
          </label>
          {failure.agreement && (
            <div className="validation">{failure.agreement}</div>
          )}
        </div>

        <div>
          <input type="submit" disabled={disabled} />
        </div>
      </form>
    </div>
  );
}
