import React from "react";
import styled from "styled-components";
import { IoClose, IoSearch } from "react-icons/io5";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "react-click-outside-hook";
import { useEffect } from "react";
import { useRef } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import useDebounce from "./debounceHook.js";
import Recipe from "./recipe.js";
import { useNavigate } from "react-router-dom";

const SearchBarContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 34em;
  height: 3.8em;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 2px 12px 3px rgba(0, 0, 0, 0.14);
`;

const SearchInputContainer = styled.div`
  width: 100%;
  min-height: 4em;
  display: flex;
  align-items: center;
  position: relative;
  padding: 2px 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 21px;
  color: #12112e;
  font-weight: 500;
  border-radius: 6px;
  background-color: transparent;

  &:focus {
    outline: none;
    &::placeholder {
      opacity: 0;
    }
  }

  &::placeholder {
    color: #bebebe;
    transition: all 250ms ease-in-out;
  }
`;

const SearchIcon = styled.span`
  color: #bebebe;
  font-size: 27px;
  margin-right: 10px;
  margin-top: 6px;
  vertical-align: middle;
`;

const CloseIcon = styled(motion.span)`
  color: #bebebe;
  font-size: 23px;
  vertical-align: middle;
  transition: all 200ms ease-in-out;
  cursor: pointer;

  &:hover {
    color: #dfdfdf;
  }
`;

const LineSeperator = styled.div`
  width: 100%;
  height: 2px;
  background-color: #d8d8d878;
`;

const SearchContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1em;
  overflow-y: auto;
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WarningMessage = styled.div`
  color: #a1a1a1;
  font-size: 16px; /* Adjust font size as needed */
  margin-top: 10px; /* Add margin for better spacing */
  text-align: center; /* Center align the warning message */
`;

const containerVariants = {
  expanded: {
    height: "30em",
  },
  collapsed: {
    height: "3.8em",
  },
};

const containerTransition = { type: "spring", damping: 22, stiffness: 200 };

export default function SearchBar(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [parentRef, isClickedOutside] = useClickOutside();
  const inputRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [noRecipes, setNoRecipes] = useState(false);
  const isEmpty = !recipes || recipes.length === 0;
  const navigate = useNavigate();

  const changeHandler = (e) => {
    e.preventDefault();
    if (e.target.value.trim() === "") setNoRecipes(false);

    setSearchQuery(e.target.value);
  };

  const expandContainer = () => {
    setExpanded(true);
  };

  const collapseContainer = () => {
    setExpanded(false);
    setSearchQuery("");
    setLoading(false);
    setNoRecipes(false);
    setRecipes([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    if (isClickedOutside) collapseContainer();
  }, [isClickedOutside]);

  const prepareSearchQuery = (query) => {
    return `http://localhost:5000/search/${props.type}?q=${query}`;
  };

  const navigateToPage = (item) => {
    let state = {};
    switch (props.type) {
      case "cuisine":
        state = {
          type: "Cuisine",
          sid: item.id,
          sname: item.name,
          description: item.description,
          spice: item.spice_level,
          origin: item.origin,
        };
        break;
      case "meal":
        state = {
          type: "Meal",
          sid: item.id,
          sname: item.name,
          description: item.description,
          spice: null,
          origin: null,
        };
        break;
      case "user":
        state = {
          type: "User",
          uid: item.id,
          uname: item.name,
          // Add other user-related properties here if needed
        };
        break;
      default:
        state = {
          type: props.type.charAt(0).toUpperCase() + props.type.slice(1),
          sid: item.id,
          sname: item.name,
          description: item.description,
          spice: item.spice_level,
          origin: item.origin,
        };
        break;
    }
    if (props.type == 'user')
    {
      if (props.id == item.id)
      {
        navigate(`/Profile/${item.id}`) 
      }
      else
      {
        navigate(`/Profile/${item.id}/${props.id}`) 
      }
    }
    else{
    navigate(`/SRecipes/${props.id}/${item.name}`, {
      state: state,
    });
  }
  };

  const searchRecipe = async () => {
    if (!searchQuery || searchQuery.trim() === "") return;

    setLoading(true);
    setNoRecipes(false);

    const URL = prepareSearchQuery(searchQuery);

    try {
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data && data.length === 0) {
        setNoRecipes(true);
      }

      switch (props.type) {
        case "recipe":
          setRecipes(
            data.recipes.map((recipe) => ({
              id: recipe.fr_id,
              thumbnailSrc:
                recipe.food_photo && recipe.food_photo.medium,
              name: recipe.food_name,
              rating: recipe.rating,
            }))
          );
          break;
        case "ingredient":
          setRecipes(
            data.recipes.map((category) => ({
              id: category.ic_id,
              name: category.category_name,
            }))
          );
          break;
        case "cuisine":
          setRecipes(
            data.recipes.map((cuisine) => ({
              id: cuisine.cuisine_id,
              name: cuisine.cuisine_name,
              description: cuisine.description,
              spice_level: cuisine.spice_level,
              origin: cuisine.origin,
            }))
          );
          break;
        case "meal":
          setRecipes(
            data.recipes.map((meal) => ({
              id: meal.category_id,
              name: meal.category_name,
              description: meal.description,
            }))
          );
          break;
        case "user":
          setRecipes(
            data.users.map((user) => ({
              id: user.user_id,
              name: user.fullname,
              // Add other user-related properties here if needed
            }))
          );
          break;
        default:
          // Handle unknown type
          break;
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  useDebounce(searchQuery, 500, searchRecipe);

  return (
    <SearchBarContainer
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={containerVariants}
      transition={containerTransition}
      ref={parentRef}
    >
      <SearchInputContainer>
        <IoSearch />
        <SearchInput
          placeholder={`Search for ${props.type}`}
          onFocus={expandContainer}
          ref={inputRef}
          value={searchQuery}
          onChange={changeHandler}
        />
        <AnimatePresence>
          {isExpanded && <IoClose onClick={collapseContainer} />}
        </AnimatePresence>
      </SearchInputContainer>
      {isExpanded && <LineSeperator />}
      {isExpanded && (
        <SearchContent>
          {isLoading && (
            <LoadingWrapper>
              <MoonLoader loading color="#000" size={20} />
            </LoadingWrapper>
          )}
          {!isLoading && isEmpty && !noRecipes && (
            <LoadingWrapper>
              <WarningMessage>Start typing to Search</WarningMessage>
            </LoadingWrapper>
          )}
          {!isLoading &&
            !isEmpty &&
            recipes.map((item) => (
              <div
                key={item.id}
                onClick={() => navigateToPage(item)}
                style={{
                  cursor: "pointer",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between", // Adjusted to push rating to the rightmost margin
                }}
              >
                <div>{item.name}</div>
                {item.rating && <div>{item.rating}</div>} {/* Render rating if it exists */}
              </div>
            ))}
        </SearchContent>
      )}
    </SearchBarContainer>
  );
}
