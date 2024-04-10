import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import ProductH from "../../../images/product/h.png";
import Dropzone from "react-dropzone";
import SimpleBar from "simplebar-react";
import DatePicker from "react-datepicker";
import { teamList } from "./ProjectData";
import DataTable from "react-data-table-component";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  BlockDes,
  Icon,
  Row,
  Col,
  Button,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,

  BackTo,
  PreviewCard,
  ReactDataTable,
} from "../../../components/Component";
import { Card,Table, Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { productData, categoryOptions } from "../employees/ProductData";
import { useForm } from "react-hook-form";
import { Modal, ModalBody,Form } from "reactstrap";
import { RSelect } from "../../../components/Component";
import axios from "../../../axios";



//import { DataTableData, dataTableColumns, dataTableColumns2, userData } from "./TableData";

const BusinessUnits = () => {
  const [data, setData] = useState(productData);
  const [sm, updateSm] = useState(false);
  
  const [dataTableData, setDataTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('asc');
 
  const [filteredData, setFilteredData] = useState([]);
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
  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
  });
  //const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);
  const [files, setFiles] = useState([]);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [searchText, setSearchText] = useState("");
  //scroll off when sidebar shows
  useEffect(() => {
    view.add ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
  }, [view.add])


  // function to close the form modal
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

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
  // ---------------8.4.24--------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    setSearchTerm(e.target.value);

 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      // Your Axios POST request to submit form data to the backend
      // Example format:
      const response = await axios.post('/businessunit/add', formData);
    
      // Optionally, you can reset the form after successful submission
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
      toast.success('Business unit added successfully');
    } catch (error) {
      console.error('Error adding business unit:', error);
      // Show error message to the user
      toast.error('Error adding business unit');
    }
  };


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
 const  onEditClick = (cellData) =>{

  console.log(cellData);
  }

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
      selector: (row, index) => index + 1,
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
      selector: (row) => row.timeZone,
      sortable: true
    },
    {
      name: 'Country',
      selector: (row) => row.country,
      sortable: true
    },
    {
      name: 'State',
      selector: (row) => row.state,
      sortable: true
    },
    {
      name: 'District',
      selector: (row) => row.district,
      sortable: true
    },
    {
      name: 'City',
      selector: (row) => row.city,
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

  //modal
  
  const closeModal = () => {
    setModal({ add: false })
    resetForm();
  };

  const closeEditModal = () => {
    setModal({ edit: false })
    resetForm();
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = dataTableData.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { register,  reset, formState: { errors } } = useForm();
  //search text
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
  }, [searchText, data]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

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
                  
                {/* <li>
                  <Input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </li> */}
                  <li className="nk-block-tools-opt">
                    <Button
                      className="toggle btn-icon d-md-none"
                      color="primary"
                      onClick={() => {
                        toggle("add");
                      }}
                    >
                      <Icon name="plus"></Icon>
                    </Button>
                    <li className="nk-block-tools-opt" 
                     onClick={(ev) => {
                            ev.preventDefault();
                           
                            toggle("add");
                            
                          }}>
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
            
            {/* <ReactDataTable data={dataTableData} columns={dataTableColumns} expandableRows pagination /> */}
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
      <DataTable
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

        
      />
     
    

            {/* <DataTable
      title="User Data"
      columns={dataTableColumns}
      data={dataTableData}
      pagination
      highlightOnHover
      striped
      progressPending={loading}
      progressComponent={<h2>Loading...</h2>}
    /> */}
          </PreviewCard>
        </Block> 
        {/* Data table */}
      {/* Modal */}
      <Modal isOpen={view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
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
            <h5 className="title">Update Business unit</h5>
            <div className="mt-4">
              <form noValidate >
                {/* onSubmit={handleSubmit(onEditSubmit)} */}
                <Row className="g-3">
                  <Col size="12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="product-title">
                        Product Title
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          {...register('name', {
                            required: "This field is required",
                          })}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="regular-price">
                        Regular Price
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="number"
                          {...register('price', { required: "This is required" })}
                          className="form-control"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}/>
                        {errors.price && <span className="invalid">{errors.price.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="sale-price">
                        Sale Price
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="number"
                          className="form-control"
                          {...register('salePrice')}
                          value={formData.salePrice} 
                          onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}/>
                        {errors.salePrice && <span className="invalid">{errors.salePrice.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="stock">
                        Stock
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="number"
                          className="form-control"
                          {...register('stock', { required: "This is required" })}
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                        {errors.stock && <span className="invalid">{errors.stock.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="SKU">
                        SKU
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          {...register('sku', { required: "This is required" })}
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}/>
                        {errors.sku && <span className="invalid">{errors.sku.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col size="12">
                    <div className="form-group">
                      <label className="form-label" htmlFor="category">
                        Category
                      </label>
                      <div className="form-control-wrap">
                        <RSelect
                          isMulti
                          options={categoryOptions}
                          value={formData.category}
                          onChange={(value) => setFormData({ ...formData, category: value })}
                          //ref={register({ required: "This is required" })}
                        />
                        {errors.category && <span className="invalid">{errors.category.message}</span>}
                      </div>
                    </div>
                  </Col>
                  <Col size="6">
                    <div className="form-group">
                      <label className="form-label" htmlFor="category">
                        Product Image
                      </label>
                      <div className="form-control-wrap">
                        <img src={formData.img} alt=""></img>
                      </div>
                    </div>
                  </Col>
                  <Col size="6">
                    <Dropzone onDrop={(acceptedFiles) => handleDropChange(acceptedFiles)}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div
                            {...getRootProps()}
                            className="dropzone upload-zone small bg-lighter my-2 dz-clickable"
                          >
                            <input {...getInputProps()} />
                            {files.length === 0 && <p>Drag 'n' drop some files here, or click to select files</p>}
                            {files.map((file) => (
                              <div
                                key={file.name}
                                className="dz-preview dz-processing dz-image-preview dz-error dz-complete"
                              >
                                <div className="dz-image">
                                  <img src={file.preview} alt="preview" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </Col>

                  <Col size="12">
                    <Button color="primary" type="submit">
                      <Icon className="plus"></Icon>
                      <span>Update Business unit</span>
                    </Button>
                  </Col>
                </Row>
              </form>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {/* Add busniess unit modal */}
      <Modal isOpen={view.add} toggle={() => onFormCancel()} className="modal-dialog-centered" size="xl">
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
            <h5 className="title">Add Business unit</h5>
            <div className="mt-4">
              <form noValidate >
                {/* onSubmit={handleSubmit(onEditSubmit)} */}
                <Row className="g-3">
                <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Name
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
                    Code
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
                    Started On
                  </label>
                  <div className="form-control-wrap">
                    <input
                      type="date"
                      {...register('startedOn', { required: "This field is required" })}
                      className="form-control"
                      value={formData.startedOn}
                      onChange={(e) => setFormData({ ...formData, startedOn: e.target.value })}
                    />
                    {errors.startedOn && <span className="invalid">{errors.startedOn.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="time-zone">
                    Time Zone
                  </label>
                  <div className="form-control-wrap">
                  <select
                      className="form-control"
                      {...register('timeZone')}
                      value={formData.timeZone}
                      onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                    >
                      <option value="">Select Time Zone</option>
                      <option value="GMT">GMT</option>
                      <option value="EST">EST</option>
                    </select>
                    {errors.timeZone && <span className="invalid">{errors.timeZone.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="country">
                    Country
                  </label>
                  <div className="form-control-wrap">
                  <select
                  className="form-control"
                  {...register('country')}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  <option value="">Select Country</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
                    {errors.country && <span className="invalid">{errors.country.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="state">
                    State
                  </label>
                  <div className="form-control-wrap">
                  <select
                    className="form-control"
                    {...register('state')}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  >
                    <option value="">Select State</option>
                    <option value="California">California</option>
                    <option value="New York">New York</option>
                  </select>
                    {errors.state && <span className="invalid">{errors.state.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="district">
                    District
                  </label>
                  <div className="form-control-wrap">
                  <select
                    className="form-control"
                    {...register('district')}
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  >
                    <option value="">Select District</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Manhattan">Manhattan</option>
                  </select>
                    {errors.district && <span className="invalid">{errors.district.message}</span>}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="city">
                    City
                  </label>
                  <div className="form-control-wrap">
                  <select
                className="form-control"
                {...register('city')}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                <option value="">Select City</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="New York City">New York City</option>
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
                    Status
                  </label>
                  <div className="form-control-wrap">
                    <select
                      className="form-control"
                      {...register('status')}
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
                      <Button color="primary" size="md" type="submit" onClick={handleSubmit}>
                  
                       Save
                      </Button>
                    </li>
                  </ul>
                </Col>
                </Row>
              </form>
            </div>
          </div>
        </ModalBody>
      </Modal>




      {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
    </Content>


  </>;
};

export default BusinessUnits;
