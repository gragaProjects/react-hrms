import React, { useState, useEffect } from "react";
import Head from "../../../../layout/head/Head";
import Content from "../../../../layout/content/Content";
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
} from "../../../../components/Component";
import { useForm } from "react-hook-form";
import { Modal, ModalBody, Form } from "reactstrap";
import axios from "../../../../axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classNames from "classnames";

const City = () => {
  const [sm, updateSm] = useState(false);
  const [dataTableData, setDataTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    country: '',
    state: '',
    district: '',
    cityName: ''
  });
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [searchText, setSearchText] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);

  useEffect(() => {
    view.add ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
  }, [view.add])

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

  useEffect(() => {
    fetchCountries();
  }, []);

  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      country: '',
      state: '',
      district: '',
      cityName: ''
    });
    reset({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isValid = await trigger();
      if (isValid) {
        const response = await axios.post('/city/add', formData);
        setDataTableData([...dataTableData, response.data]);
        toast.success('City added successfully', { position: "top-right" });
        setView({ ...view, add: false });
      } else {
        console.log('Form validation failed');
      }
    } catch (error) {
      console.error('Error adding city:', error);
      toast.error(error.response.data.message);
    }
  };

  const onEditClick = (cellData) => {
    resetForm();
    const editedData = dataTableData.find(item => item._id === cellData);
    setFormData(editedData);
    setView({ ...view, edit: true });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/city/update/${formData._id}`, formData);
      toast.success('City updated successfully', { position: "top-right" });
      setDataTableData(dataTableData.map(item => {
        if (item._id === formData._id) {
          return formData;
        }
        return item;
      }));
      resetForm();
      setView({ ...view, edit: false });
    } catch (error) {
      console.error('Error updating city:', error);
      toast.error('Error updating city');
    }
  };

  const deleteCity = async (id) => {
    try {
      await axios.delete(`/city/delete/${id}`);
      toast.success('City deleted successfully', { position: "top-right" });
      setDataTableData(dataTableData.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting city:', error);
      toast.error('Error deleting city');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/city/get');
        setDataTableData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const customActionsCell = (cellData, cellMeta) => {
    return (
      <div>
        <Button className="btn-round btn-icon" color="primary" size="sm"
          onClick={(ev) => {
            ev.preventDefault();
            onEditClick(cellData);
          }}>
          <Icon name="edit" />
        </Button>
        <Button className="btn-round btn-icon" color="danger" size="sm"
          onClick={(ev) => {
            ev.preventDefault();
            deleteCity(cellData);
          }}>
          <Icon name="trash" />
        </Button>
      </div>
    );
  };

  const dataTableColumns = [
    {
      name: "Actions",
      label: "Actions",
      cell: (rowData, rowIndex) => customActionsCell(rowData._id, rowIndex),
      width: '200px'
    },
    {
      name: 'S.No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '200px'
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
      name: 'City Name',
      selector: (row) => row.cityName,
      sortable: true
    }
  ];

  const { register, reset, trigger, formState: { errors } } = useForm();
  const formClass = classNames({
    "form-validate": true,
  });

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
    <Head title="Cities"></Head>
    <Content>
      <BlockHead size="sm">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle>Cities</BlockTitle>
          </BlockHeadContent>
          <BlockHeadContent>
            <div className="toggle-wrap nk-block-tools-toggle">
              <a href="#more" className="btn btn-icon btn-trigger toggle-expand me-n1"
                onClick={(ev) => {
                  ev.preventDefault();
                  updateSm(!sm);
                }}>
                <Icon name="more-v"></Icon>
              </a>
              <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                <ul className="nk-block-tools g-3">
                  <li className="nk-block-tools-opt">
                    <Button color="primary" onClick={() => {setView({ ...view, add: true })}}>
                      <Icon name="plus"></Icon>
                      <span>Add City</span>
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </BlockHeadContent>
        </BlockBetween>
      </BlockHead>

      <Block size="lg">
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
            title=""
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

      <Modal isOpen={view.add || view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="xl">
        <ModalBody>
          <a href="#cancel" className="close" onClick={(ev) => {
            ev.preventDefault();
            onFormCancel();
          }}>
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">{view.edit ? 'Update' : 'Add'} City</h5>
            <div className="mt-4">
              <Form className={formClass} onSubmit={view.edit ? handleUpdate : handleSubmit}>
                <Row className="g-3">
                  <Col md="4">
                    <div className="form-group">
                      <label className="form-label" htmlFor="country">
                        Country <span  className="error">*</span>
                      </label>
                      <div className="form-control-wrap">
                        <select
                          className="form-control"
                          {...register('country', { required: "Please select a Country" })}
                          value={formData.country}
                          onChange={(e) => {
                            setFormData({ ...formData, country: e.target.value });
                            fetchStatesByCountry(e.target.value);
                          }}
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
                          {...register('state', { required: "Please select a State" })}
                          value={formData.state}
                          onChange={(e) => {
                            setFormData({ ...formData, state: e.target.value });
                            fetchDistrictsByState(e.target.value);
                          }}
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
                          {...register('district', { required: "Please select a District" })}
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
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
                      <label className="form-label" htmlFor="cityName">
                        City Name <span  className="error">*</span>
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          {...register('cityName', { required: "This field is required" })}
                          className="form-control"
                          value={formData.cityName}
                          onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
                        />
                        {errors.cityName && <span className="invalid">{errors.cityName.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col size="12">
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
            </div>
          </div>
        </ModalBody>
      </Modal>
    </Content>
  </>;
};

export default City;
