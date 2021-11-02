// @ts-nocheck
import React, { FunctionComponent, ReactNode, useState } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import FilterTypeDropDown from "./FitlerTypeDropDown";
import { useNotebookContext } from "../NotebookContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";

type Props = {
  id: string;
  type: string;
};

const Filter: FunctionComponent<Props> = (props) => {
  const { id, type } = props;
  const {
    setFilterInputs,
    filterInputs,
    getFilterColumnByKey,
    getFilterOptionsByKey,
  } = useNotebookContext();
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState([]);

  const filterColumn = getFilterColumnByKey(type);
  const filterOptions = getFilterOptionsByKey(type);
  const [value, onChange] = useState([new Date(), new Date()]);

  console.log(filterOptions);

  const fetchAutocompleteSuggestions = async (type, query) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BFF_PROXY_ENDPOINT_URL}/autocomplete/?type=${type}&query=${query}`
      );
      const data = await response.json();

      setAutoCompleteSuggestions(data);
    } catch (error) {
      // TODO: Impelment Error handling
    }
  };

  const filterTypeRender = (filterType) => {
    switch (filterType) {
      case "date":
        return (
          <DateTimeRangePicker
            format="mm/dd/yyyy"
            onChange={onChange}
            value={value}
          />
        );

      default:
        return (
          <FormControl
            className="border-end-0"
            size="sm"
            onChange={(event) =>
              filterOptions.autocomplete &&
              fetchAutocompleteSuggestions(type, event.target.value)
            }
          />
        );
    }
  };

  // const autoCompleteListRender = () => {
  //  return <ListGroup>
  //   <ListGroup.Item>Cras justo odio</ListGroup.Item>
  //   <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
  //   <ListGroup.Item>Morbi leo risus</ListGroup.Item>
  //   <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
  //   <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
  // </ListGroup>
  //  }

  return (
    <div
      className="d-inline-block me-3"
      style={{
        width:
          (filterColumn?.width && filterOptions?.type !== "date") || "auto",
        minWidth: "230px",
      }}
    >
      <InputGroup className="mb-3">
        <InputGroup.Text className="bg-white">
          <FilterTypeDropDown id={id} />
        </InputGroup.Text>
        {filterTypeRender(filterOptions?.type)}
        <InputGroup.Text
          className="cursor-pointer bg-transparent"
          onClick={() =>
            setFilterInputs(() => [
              ...filterInputs.filter((filterInput) => filterInput.id !== id),
            ])
          }
        >
          <FontAwesomeIcon icon={faTimesCircle} className="text-muted" />
        </InputGroup.Text>
      </InputGroup>
    </div>
  );
};

export default Filter;