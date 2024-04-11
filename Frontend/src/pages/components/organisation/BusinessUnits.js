import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import DataTable from "react-data-table-component";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Icon,
  Row,
  Col,
  Button,
  PreviewCard,
 // ReactDataTable,
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { Modal, ModalBody,Form } from "reactstrap";
import axios from "../../../axios";
//toast notfication
import { toast ,ToastContainer,Bounce  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classNames from "classnames";

const BusinessUnits = () => {
  const [sm, updateSm] = useState(false);
  const [dataTableData, setDataTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  //State Data
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    startedOn: '',
    timeZone: '',
    country: '',
    state: '',
    district: '',
    city: '',
    description: '',
    address: '',
    leaveStructure: '',
    holidayStructure: '',
    status: ''
  });
  
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  //const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [searchText, setSearchText] = useState("");
  //scroll off when sidebar shows
  useEffect(() => {
    view.add ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
  }, [view.add])

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [timezoneOptions, setTimezoneOptions ] = useState([]);
  // function to close the form modal
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };
 // ---------------Reset  State--------------------
    const resetForm = () => {
      setFormData({
        name: '',
      code: '',
      startedOn: '',
      timeZone: '',
      country: '',
      state: '',
      district: '',
      city: '',
      description: '',
      address: '',
      leaveStructure: '',
      holidayStructure: '',
      status: ''
      });
      reset({});
    };
  // ---------------Add Data--------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const isValid = await trigger(); // Trigger form validation
    
      if (isValid) {
        const response = await axios.post('/businessunit/add', formData);
        resetForm();
        setDataTableData([...dataTableData, response.data]);
        setFormData({
          name: '',
          code: '',
          startedOn: '',
          timeZone: '',
          country: '',
          state: '',
          district: '',
          city: '',
          description: '',
          address: '',
          leaveStructure: '',
          holidayStructure: '',
          status: ''
        });
        // Show success message to the user
        toast.success('Added successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
  
        setView({ ...view, add: false });
          // Refresh the page
       window.location.reload();
      } else {
        console.log('Form validation failed');
      }

    
    } catch (error) {
      console.error('Error adding business unit:', error);
      console.log(error.response.data.message);
      // Show error message to the user
      toast.error(error.response.data.message);
    }
  };

  // ---------------Edit  Data--------------------

  //  const onEditClick = (cellData) => {
  //   resetForm();
  //   // Fetch the data for the cellData from dataTableData and set it to the formData state
  //   const editedData = dataTableData.find(item => item._id === cellData);
  //   //console.log(editedData);
  //   setFormData(editedData);
    
  //   setView({ ...view, edit: true });
  // };
  const onEditClick = (cellData) => {
    resetForm();
    try {
      // Fetch the data for the cellData from dataTableData and set it to the formData state
      const editedData = dataTableData.find(item => item._id === cellData);
    //  console.log(editedData);
      setFormData({
        ...editedData,
        // Set district and city directly from the edited data
        timeZone: editedData.timeZone ? editedData.timeZone._id : '',
        country: editedData.country ? editedData.country._id : '',
        state: editedData.state ? editedData.state._id : '',
        district: editedData.district ? editedData.district._id : '',
        city: editedData.city ? editedData.city._id : ''
      });
      setView({ ...view, edit: true });
    } catch (error) {
      console.error('Error editing business unit:', error);
    }
  };

  // Function to handle updating existing data
  const handleUpdate = async () => {
    try {
      const isValid = await trigger(); // Trigger form validation
      if (isValid) {
     const response = await axios.put(`/businessunit/update/${formData._id}`, formData);
            // Update the dataTableData state with the updated department data
    setDataTableData(dataTableData.map(item => {
      if (item._id === formData._id) {
        return formData; // Update the data for the edited department
      }
      return item;
    }));
      // Show success message to the user
      toast.success('Updated successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

     


          // Optionally, you can reset the form after successful update
          resetForm();

       // Close the modal after successful update
        setView({ ...view, edit: false });
        // Refresh the page
       window.location.reload();
    }

    } catch (error) {
      console.error('Error updating business unit:', error);
      // Show error message to the user
      toast.error('Error updating business unit');
    }
  };

  // ---------------Delete Data--------------------
  
  // Function to handle deleting a row
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/businessunit/delete/${id}`);
   
      // Show success message to the user
      toast.success('Deleted successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
         // Update dataTableData state by filtering out the deleted row
         setDataTableData(dataTableData.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting business unit:', error);
      // Show error message to the user
      toast.error('Error deleting business unit');
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    setSearchTerm(e.target.value);

 
  };
   // ---------------Fetch  Data--------------------

  useEffect(() => {
    // Fetch data from your backend API
    const fetchData = async () => {
      try {
        const response = await axios.get('/businessunit/get');
  
        setDataTableData(response.data);
        setLoading(false);
       // console.log(DataTableData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

// ---------------Display  Data table--------------------
  //custom,
  const customActionsCell = (cellData, cellMeta) => {
    return (
      <div>
        <Button className="btn-round btn-icon" color="primary" size="sm" 
          onClick={(ev) => {
            ev.preventDefault();
            onEditClick(cellData);
            // Assuming toggle is defined somewhere in the scope
            //toggle("edit");
          }}>
          <Icon name="edit" />
        </Button>

        <Button className="btn-round btn-icon" color="danger" size="sm"  
          onClick={(ev) => {
            ev.preventDefault();
            deleteProduct(cellData);
          }}>
          <Icon name="trash" />
        </Button>
      </div>
    );
  };
  //table data
  const dataTableColumns = [
    {
      name: "Actions",
      label: "Actions",
      cell: (rowData, rowIndex) => customActionsCell(rowData._id, rowIndex),
    },
    {
      name: 'S.No.',
      selector: (row, index) => startIndex +  index + 1,
      sortable: false,
      width: '70px' // Adjust the width as needed
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true
    },
    {
      name: 'Code',
      selector: (row) => row.code,
      sortable: true
    },
    {
      name: 'Started On',
      selector: (row) => row.startedOn,
      sortable: true,
      format: (row) => {
        // Assuming row.startedOn is a string in 'YYYY-MM-DD' format
        const date = new Date(row.startedOn);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      },
      width: "150px" 
    },
    {
      name: 'Time Zone',
      selector: (row) => row.timeZone?.timezone,
      sortable: true
    },
    {
      name: 'Country',
      selector: (row) => row.country?.countryName,
      sortable: true
    },
    {
      name: 'State',
      selector: (row) => row.state?.stateName,
      sortable: true
    },
    {
      name: 'District',
      selector: (row) => row.district?.districtName,
      sortable: true
    },
    {
      name: 'City',
      selector: (row) => row.city?.cityName,
      sortable: true
    },
    {
      name: 'Description',
      selector: (row) => row.description,
      sortable: true,
      width: "200px" 
    },
    {
      name: 'Address',
      selector: (row) => row.address,
      sortable: true
    },
    {
      name: 'Leave Structure',
      selector: (row) => row.leaveStructure,
      sortable: true
    },
    {
      name: 'Holiday Structure',
      selector: (row) => row.holidayStructure,
      sortable: true
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true
    },
  

  ];
  
  // ------------------------------------

  //forms
  const { register,  reset,trigger , formState: { errors } } = useForm();
  const formClass = classNames({
    "form-validate": true,
    //"is-alter": alter,
  });
  //console.log(errors);

  //--------Search box filter Data---------///
  useEffect(() => {
    if (searchText === "") {
      setFilteredData([]);
    } else {
      const filtered = dataTableData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchText, dataTableData]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

 
  //--------date format--------///

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
  
    // Pad month and day with leading zeros if needed
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
  
    return `${year}-${month}-${day}`;
  };
   
  
      //--------------fetch dropdown  data--------------------
      useEffect(() => {
        fetchCountries();
      }, []);
      useEffect(() => {
        fetchTimezone();
      }, []);

      const fetchCountries = async () => {
        try {
          const response = await axios.get('/country/get');
          setCountryOptions(response.data);
        } catch (error) {
          console.error('Error fetching countries:', error);
        }
      };
    
      const fetchStatesByCountry = async (countryId) => {
        try {
          const response = await axios.get(`/state/getByCountry/${countryId}`);
          setStateOptions(response.data);
        } catch (error) {
          console.error('Error fetching states:', error);
        }
      };
    
      const fetchDistrictsByState = async (stateId) => {
        try {
          const response = await axios.get(`/district/getByState/${stateId}`);
          setDistrictOptions(response.data);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      };
      const fetchCitiesByDistrict = async (districtId) => {
        try {
          const response = await axios.get(`/city/getByDistrict/${districtId}`);
          setCityOptions(response.data);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };

      const fetchTimezone = async () => {
        try {
          const response = await axios.get('/timezone/get');
          setTimezoneOptions(response.data);
        } catch (error) {
          console.error('Error fetching countries:', error);
        }
      };
      useEffect(() => {
        // Update stateOptions when formData.country changes
        fetchStatesByCountry(formData.country);
       }, [formData.country]);

      useEffect(() => {
        // Update stateOptions when formData.state changes
        fetchDistrictsByState(formData.state);
       }, [formData.state]);

    useEffect(() => {
        // Update districtOptions when formData.district changes
        fetchCitiesByDistrict(formData.district);
    }, [formData.district]);

         //--------------fetch dropdown  data--------------------
    //--------------pagenation-------------------
     // Function to handle page change
const handlePageChange = (page) => {
  // Adjust the page index since it starts from 0
  setCurrentPage(page);
};

// Calculate the index range based on current page and items per page
const startIndex = (currentPage - 1) * itemPerPage;
const endIndex = Math.min(startIndex + itemPerPage, dataTableData.length);

// Slice the data array to get the data for the current page
const dataForCurrentPage = dataTableData.slice(startIndex, endIndex);


    //--------------pagenation-------------------

  return <>
    <Head title="Business Units"></Head>
    <Content>
      <BlockHead size="sm">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle>Business Units</BlockTitle>
          </BlockHeadContent>
          <BlockHeadContent>
            <div className="toggle-wrap nk-block-tools-toggle">
              <a
                href="#more"
                className="btn btn-icon btn-trigger toggle-expand me-n1"
                onClick={(ev) => {
                  ev.preventDefault();
                  updateSm(!sm);
                }}
              >
                <Icon name="more-v"></Icon>
              </a>
              <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                <ul className="nk-block-tools g-3">
         
                  <li className="nk-block-tools-opt">
                    <Button
                      className="toggle btn-icon d-md-none"
                      color="primary"
                      // onClick={() => {
                      //   toggle("add");
                      // }}
                      onClick={() => setView({ ...view, add: true })}
                    >
                      <Icon name="plus"></Icon>
                    </Button>
                    <li className="nk-block-tools-opt" onClick={() => setView({ ...view, add: true })}

                    >
                      {/* onClick={(ev) => { ev.preventDefault(); toggle("add"); }} */}
                    <Button color="primary">
                      <Icon name="plus"></Icon>
                      <span>Add Business unit</span>
                    </Button>
                  </li>
                 
                  </li>
                </ul>
              </div>
            </div>
          </BlockHeadContent>
        </BlockBetween>
      </BlockHead>
  
  {/* Data table */}
      <Block size="lg">
          <BlockHead>
          
          </BlockHead>

          <PreviewCard>
            
          
       <Col size="12" >
          <div className="align-end flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end">
      <Col md="2">
        <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={handleSearchChange}
        className="form-control"
      />
      </Col>
      </div>
      </Col>
      {/* <DataTable
        title=""//User Data
        columns={dataTableColumns}
        data={searchText ? filteredData : dataTableData}
        pagination
        paginationServer
        paginationTotalRows={searchText ? filteredData.length : dataTableData.length}
        highlightOnHover
        striped
        progressPending={loading}
        progressComponent={<p>Loading...</p>}

        
      /> */}
     <DataTable
  title="" // User Data
  columns={dataTableColumns}
  data={searchText ? filteredData : dataForCurrentPage}
  pagination
  paginationServer
  paginationTotalRows={searchText ? filteredData.length : dataTableData.length}
  paginationPerPage={itemPerPage} // Set the number of items per page
  paginationComponentOptions={{
    rowsPerPageText: 'Items per page:',
    rangeSeparatorText: 'of',
    selectAllRowsItem: false,
    selectAllRowsItemText: 'All'
  }}
  onChangePage={handlePageChange} // Handle page change event
  highlightOnHover
  striped
  progressPending={loading}
  progressComponent={<p>Loading...</p>}
/>
    
    
    <ToastContainer />
     
  
          </PreviewCard>
        </Block> 
       
      {/* Add busniess unit modal */}
      <Modal isOpen={view.add || view.edit}  toggle={() => onFormCancel()} className="modal-dialog-centered" size="xl">
        <ModalBody>
          <a href="#cancel" className="close">
            {" "}
            <Icon
              name="cross-sm"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
            ></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">  {view.edit ? 'Update' : 'Add'} Business unit</h5>
            <div className="mt-4">
            <Form className={formClass}  onSubmit={view.edit ? handleUpdate : handleSubmit}>
              {/* <form  onSubmit={view.edit ? handleUpdate : handleSubmit}> */}
                {/* onSubmit={handleSubmit(onEditSubmit)} */}
                <Row className="g-3">
                <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Name  <span  className="error">*</span>
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      {...register('name', { required: "This field is required" })}
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <span className="invalid">{errors.name.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="code">
                    Code <span  className="error">*</span>
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      {...register('code', { required: "This field is required" })}
                      className="form-control"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                    {errors.code && <span className="invalid">{errors.code.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="started-on">
                    Started On <span  className="error">*</span>
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="date"
                      {...register('startedOn', { required: "This field is required" })}
                      className="form-control"
                      value={formData.startedOn ? formatDate(formData.startedOn) : ''}
                      onChange={(e) => setFormData({ ...formData, startedOn: e.target.value })}
                    />
                    {errors.startedOn && <span className="invalid">{errors.startedOn.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="time-zone">
                    Time Zone <span  className="error">*</span>
                  </label>
                  <div className="form-control-wrap">
                  <select
                      className="form-control"
                      {...register('timeZone', { required: "This field is required" })}
                      value={formData.timeZone}
                      onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                    >
                      <option value="">Select Time Zone</option>
                      {/* <option value="GMT">GMT</option>
                      <option value="EST">EST</option> */}

                            {timezoneOptions.map(timezone => (
                            <option key={timezone._id} value={timezone._id}>{timezone.timezone}</option>
                          ))}
                    </select>
                    {errors.timeZone && <span className="invalid">{errors.timeZone.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="country">
                    Country  <span  className="error">*</span>
                  </label>
                  <div className="form-control-wrap">
                  <select
                  className="form-control"
                  {...register('country',{ required: "This field is required" })}
                  value={formData.country}
                  onChange={(e) => {setFormData({ ...formData, country: e.target.value })  
                  fetchStatesByCountry(e.target.value); }}
                >
                 <option value="">Select Country</option>
                            {countryOptions.map(country => (
                            <option key={country._id} value={country._id}>{country.countryName}</option>
                          ))}
                </select>
                    {errors.country && <span className="invalid">{errors.country.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="state">
                    State <span  className="error">*</span>
                  </label>
                  <div className="form-control-wrap">
                  <select
                    className="form-control"
                    {...register('state',{ required: "This field is required" })}
                    value={formData.state}
                    onChange={(e) => {setFormData({ ...formData, state: e.target.value })
                    fetchDistrictsByState(e.target.value);}}
                  >
                     <option value="">Select State</option>
                     {stateOptions.map(state => (
                            <option key={state._id} value={state._id}>{state.stateName}</option>
                          ))}
                  </select>
                    {errors.state && <span className="invalid">{errors.state.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="district">
                    District <span  className="error">*</span>
                  </label>
                  <div className="form-control-wrap">
                  <select
                    className="form-control"
                    {...register('district',{ required: "This field is required" })}
                    value={formData.district}
                    onChange={(e) => { setFormData({ ...formData, district: e.target.value })
                    fetchCitiesByDistrict(e.target.value);}}
                  >
                    <option value="">Select District</option>

                     {districtOptions.map(district => (
                            <option key={district._id} value={district._id}>{district.districtName}</option>
                          ))}
                  </select>
                    {errors.district && <span className="invalid">{errors.district.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="city">
                    City <span  className="error">*</span>
                  </label>
                  <div className="form-control-wrap">
                  <select
                className="form-control"
                {...register('city',{ required: "This field is required" })}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                  <option value="">Select City</option>
  {cityOptions.map(city => (
                            <option key={city._id} value={city._id}>{city.cityName}</option>
                          ))}
              </select>
                    {errors.city && <span className="invalid">{errors.city.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                  <div className="form-control-wrap">
                    <textarea
                      {...register('description')}
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                     style={{ minHeight: '22px', width: '100%' }}
                     
                    />
                    {errors.description && <span className="invalid">{errors.description.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label" htmlFor="address">
                    Address
                  </label>
                  <div className="form-control-wrap">
                    <textarea
                      {...register('address')}
                      className="form-control"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{ minHeight: '22px', width: '100%' }}
                    />
                    {errors.address && <span className="invalid">{errors.address.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="leave-structure">
                    Leave Structure
                  </label>
                  <div className="form-control-wrap">
                  <select
                  className="form-control"
                  {...register('leaveStructure')}
                  value={formData.leaveStructure}
                  onChange={(e) => setFormData({ ...formData, leaveStructure: e.target.value })}
                >
                  <option value="">Select Leave Structure</option>
                  <option value="Paid Time Off">Paid Time Off</option>
                  <option value="Sick Leave">Sick Leave</option>
                </select>
                    {errors.leaveStructure && <span className="invalid">{errors.leaveStructure.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="holiday-structure">
                    Holiday Structure
                  </label>
                  <div className="form-control-wrap">
                  <select
                  className="form-control"
                  {...register('holidayStructure')}
                  value={formData.holidayStructure}
                  onChange={(e) => setFormData({ ...formData, holidayStructure: e.target.value })}
                >
                  <option value="">Select Holiday Structure</option>
                  <option value="National Holidays">National Holidays</option>
                  <option value="Company Holidays">Company Holidays</option>
                </select>
                    {errors.holidayStructure && <span className="invalid">{errors.holidayStructure.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="status">
                    Status <span  className="error">*</span>
                  </label>
                  <div className="form-control-wrap">
                    <select
                      className="form-control"
                      {...register('status',{ required: "This field is required" })}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    {errors.status && <span className="invalid">{errors.status.message}</span>}
                  </div>
                </div>
              </Col>
            
                  
                  <Col size="12" >
                  <ul className="align-end flex-wrap flex-sm-nowrap gx-4 gy-2 justify-content-end">
                    
                    <li>
                      <Button
                       onClick={(ev) => {
                        ev.preventDefault();
                        onFormCancel();
                      }}
                        className="link link-light"
                      >
                        Cancel
                      </Button>
                    </li>
                    <li>
                      {/* <Button color="primary" size="md" type="submit" onClick={handleSubmit}>
                  
                       Save
                      </Button> */}
                      <Button 
                        color="primary" 
                        size="md" 
                        type="button" 
                        onClick={view.edit ? handleUpdate : handleSubmit}
                      >
                        {view.edit ? 'Update' : 'Save'}
                      </Button>
                    </li>
                  </ul>
                </Col>
                </Row>
              </Form>
              {/* </form> */}
            </div>
          </div>
        </ModalBody>
      </Modal>




      {/* {view.add && <div className="toggle-overlay" onClick={toggle}></div>} */}
    </Content>


  </>;
};

export default BusinessUnits;
