import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dropdown.css";

function Dropdown(props) {
  const [dropdown, setDropdown] = useState(false);
  const [Tdata, setData] = useState([]);

  useEffect(() => {
    const fetchDropdown = async () => {
      let url = `http://localhost:5000/${props.type}/dropdown`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
        if (data.success && data.data) {
          setData(data.data);
        } else {
          console.error('No dropdown found');
        }
      } catch (error) {
        console.error('Error fetching dropdown:', error);
      }
    };

    fetchDropdown();
  }, [props.type]);

  return (
    <>
      <ul
        className={dropdown ? "services-submenu clicked" : "services-submenu"}
        onClick={() => setDropdown(!dropdown)}
      >
        { props.type == "meals" && Tdata.map((item, index) => (
          <li key={index}>
            <Link 
            className = "drop-links" 
            to={`/SRecipes/${props.id}/${item.category_name}`} 
            state= {{ 
              type: "Meal", 
              sid: item.category_id, 
              sname: item.category_name, 
              description: item.description,
              spice: null,
              origin: null,
            }}
            onClick={() => setDropdown(false)}>
              {item.category_name} {/* Render the category_name property */}
            </Link>
          </li>
        ))}

        { props.type == "cuisines" && Tdata.map((item, index) => (
          <li key={index}>
            <Link 
            className = "drop-links" 
            to={`/SRecipes/${props.id}/${item.cuisine_name}`} 
            state= {{ 
              type: "Cuisine", 
              sid: item.cuisine_id, 
              sname: item.cuisine_name, 
              description: item.description,
              spice: item.spice_level,
              origin: item.origin,
            }}
            onClick={() => setDropdown(false)}>
              {item.cuisine_name} {/* Render the category_name property */}
            </Link>
          </li>
        ))}

      { props.type == "ingredients" && Tdata.map((item, index) => (
          <li key={index}>
            <Link 
            className = "drop-links" 
            to={`/SRecipes/${props.id}/${item.cuisine_name}`} 
            state= {{ 
              type: "Ingredient", 
              sid: item.ic_id, 
              sname: item.category_name, 
              description: null,
              spice: null,
              origin: null,
            }}
            onClick={() => setDropdown(false)}>
              {item.category_name} {/* Render the category_name property */}
            </Link>
          </li>
        ))}
        { props.type == "kitchen-tips" && Tdata.map((item, index) => (
          <li key={index}>
            <Link 
            className = "drop-links" 
            onClick={() => setDropdown(false)}>
              {item.tcat_name} {/* Render the category_name property */}
            </Link>
          </li>
        ))}

{props.type === "profile" && (
          <>
            <li>
              <Link
                className="drop-links"
                to= {`/Profile/${props.id}`}
                onClick={() => setDropdown(false)}
                state = {{
                  type : "Timeline"
                }}
              >
                Timeline
              </Link>
            </li>
            <li>
              <Link
                className="drop-links"
                to= {`/Profile/${props.id}`}
                onClick={() => setDropdown(false)}
                state = {{
                  type : "SavedFoods"
                }}
              >
                Saved Foods
              </Link>
            </li>
            <li>
              <Link
                className="drop-links"
                to= {`/Profile/${props.id}`}
                onClick={() => setDropdown(false)}
                state = {{
                  type : "EditMode"
                }}
              >
                Edit Profile
              </Link>
            </li>
            <li>
              <Link
                className="drop-links"
                to= {`/Profile/${props.id}`}
                onClick={() => setDropdown(false)}
                state = {{
                  type : "EditPassword"
                }}
              >
                Change Password
              </Link>
            </li>
            <li>
              <Link
                className="drop-links"
                to= {`/Profile/${props.id}`}
                onClick={() => setDropdown(false)}
                state = {{
                  type : "InsertRecipe"
                }}
              >
                Share recipe
              </Link>
            </li>
          </>
        )}
      </ul>
    </>
  );
}

export default Dropdown;
