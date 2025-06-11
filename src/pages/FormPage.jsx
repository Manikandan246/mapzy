import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { v4 as uuidv4 } from "uuid";
import "../styles/FormPage.css";

const FormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rep_name: "",
    address: "",
    city: "",
    pincode: "",
    property_type: "",
    size: "",
    floors: "",
    condition: "",
    owner_name: "",
    owner_phone: "",
    price: "",
    notes: "",
    latitude: "",
    longitude: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let imageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Image upload failed");
        console.error(uploadError);
        setSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from("property_visits").insert([
      {
        ...formData,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      alert("Error saving data");
      console.error(error);
    } else {
      navigate("/confirmation", {
        state: { formData: { ...formData, image_url: imageUrl } },
      });
    }

    setSubmitting(false);
  };

  return (
    <div className="container">
      <div className="form-card">
        <div className="header">
          <h1>Mapzy</h1>
          <h2>Property Details</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            ["rep_name", "Rep Name"],
            ["address", "Address"],
            ["city", "City"],
            ["pincode", "Pincode"],
            ["property_type", "Property Type"],
            ["size", "Size (sqft)"],
            ["floors", "Floors"],
            ["condition", "Condition"],
            ["owner_name", "Owner Name"],
            ["owner_phone", "Owner Phone"],
            ["price", "Expected Price"],
          ].map(([key, label]) => (
            <div key={key}>
              <label>{label}</label>
              <input
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required={["rep_name", "address", "city", "property_type"].includes(key)}
              />
            </div>
          ))}

          <div>
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div>
            <label>Property Image</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <div>
            <label>Latitude</label>
            <input
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              readOnly
            />
          </div>

          <div>
            <label>Longitude</label>
            <input
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              readOnly
            />
          </div>

          <button type="button" onClick={captureLocation}>
            Capture Location
          </button>

          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
