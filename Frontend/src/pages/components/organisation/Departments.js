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
} from "../../../components/Component";
import { useForm } from "react-hook-form";
import { Modal, ModalBody, Form } from "reactstrap";
import axios from "../../../axios";
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import classNames from "classnames";

const Departments = () => {
  const [sm, updateSm] = useState(false);
  const [dataTableData, setDataTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    businessUnit: '',
    departmentName: '',
    departmentCode: '',
    departmentHead: '',
    startedOn: '',
    description: '',
    status: ''
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

  useEffect(() => {
    view.add ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
  }, [view.add])

  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      businessUnit: '',
      departmentName: '',
      departmentCode: '',
      departmentHead: '',
      startedOn: '',
      description: '',
      status: ''
    });
    reset({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isValid = await trigger();
      if (isValid) {
        const response = await axios.post('/department/add', formData);
        resetForm();
        setDataTableData([...dataTableData, response.data]);
        toast.success('Department added successfully', { position: "top-right" });
        setView({ ...view, add: false });
      } else {
        console.log('Form validation failed');
      }
    } catch (error) {
      console.error('Error adding department:', error);
      //toast.error('Error adding department');
      toast.error(error.response.data.message);
    }
  };

  const onEditClick = (cellData) => {
    resetForm();
    // Fetch the data for the cellData from dataTableData and set it to the formData state
    const editedData = dataTableData.find(item => item._id === cellData);
    //console.log(editedData);
    setFormData(editedData);
    setView({ ...view, edit: true });
  };


  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/department/update/${formData._id}`, formData);
      toast.success('Department updated successfully', { position: "top-right" });

       // Update the dataTableData state with the updated department data
    setDataTableData(dataTableData.map(item => {
        if (item._id === formData._id) {
          return formData; // Update the data for the edited department
        }
        return item;
      }));

      
      resetForm();
      setView({ ...view, edit: false });
      
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error('Error updating department');
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`/department/delete/${id}`);
      toast.success('Department deleted successfully', { position: "top-right" });
      setDataTableData(dataTableData.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Error deleting department');
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
        const response = await axios.get('/department/get');
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
            deleteDepartment(cellData);
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
    },
    {
      name: 'S.No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px'
    },
    {
      name: 'Business Unit',
      selector: (row) => row.businessUnit,
      sortable: true
    },
    {
      name: 'Department Name',
      selector: (row) => row.departmentName,
      sortable: true
    },
    {
      name: 'Department Code',
      selector: (row) => row.departmentCode,
      sortable: true
    },
    {
      name: 'Department Head',
      selector: (row) => row.departmentHead,
      sortable: true
    },
    {
      name: 'Started On',
      selector: (row) => row.startedOn,
      sortable: true,
      format: (row) => {
        const date = new Date(row.startedOn);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      },
      width: "150px" 
    },
    {
      name: 'Description',
      selector: (row) => row.description,
      sortable: true,
      width: "200px" 
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      sortable: true
    },
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
    <Head title="Departments"></Head>
    <Content>
      <BlockHead size="sm">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle>Departments</BlockTitle>
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
                    <Button color="primary" onClick={() => setView({ ...view, add: true })}>
                      <Icon name="plus"></Icon>
                      <span>Add Department</span>
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
            <h5 className="title">{view.edit ? 'Update' : 'Add'} Department</h5>
            <div className="mt-4">
            <Form className={formClass} onSubmit={view.edit ? handleUpdate : handleSubmit}>
  <Row className="g-3">
    <Col md="4">
      <div className="form-group">
        <label className="form-label" htmlFor="businessUnit">
          Business Unit <span  className="error">*</span>
        </label>
        <div className="form-control-wrap">
          <select
            className="form-control"
            {...register('businessUnit', { required: "Please select a Business Unit" })}
            value={formData.businessUnit}
            onChange={(e) => setFormData({ ...formData, businessUnit: e.target.value })}
          >
            <option value="">Select Business Unit</option>
            {/* Populate the dropdown options with data */}
            {/* Example:
            {businessUnits.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.name}</option>
            ))}
            */}
            <option value="dummy1">Dummy Business Unit 1</option>
            <option value="dummy2">Dummy Business Unit 2</option>
            <option value="dummy3">Dummy Business Unit 3</option>
          </select>
          {errors.businessUnit && <span className="invalid">{errors.businessUnit.message}</span>}
        </div>
      </div>
    </Col>
    <Col md="4">
      <div className="form-group">
        <label className="form-label" htmlFor="departmentName">
          Department Name <span  className="error">*</span>
        </label>
        <div className="form-control-wrap">
          <input
            type="text"
            {...register('departmentName', { required: "This field is required" })}
            className="form-control"
            value={formData.departmentName}
            onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
          />
          {errors.departmentName && <span className="invalid">{errors.departmentName.message}</span>}
        </div>
      </div>
    </Col>
    <Col md="4">
      <div className="form-group">
        <label className="form-label" htmlFor="departmentCode">
          Department Code <span  className="error">*</span>
        </label> 
        <div className="form-control-wrap">
          <input
            type="text"
            {...register('departmentCode', { required: "This field is required" })}
            className="form-control"
            value={formData.departmentCode}
            onChange={(e) => setFormData({ ...formData, departmentCode: e.target.value })}
          />
          {errors.departmentCode && <span className="invalid">{errors.departmentCode.message}</span>}
        </div>
      </div>
    </Col>
    <Col md="4">
      <div className="form-group">
        <label className="form-label" htmlFor="departmentHead">
          Department Head <span  className="error">*</span>
        </label>
        <div className="form-control-wrap">
          <select
            className="form-control"
            {...register('departmentHead', { required: "Please select a Department Head" })}
            value={formData.departmentHead}
            onChange={(e) => setFormData({ ...formData, departmentHead: e.target.value })}
          >
            <option value="">Select Department Head</option>
            {/* Populate the dropdown options with data */}
            {/* Example:
            {departmentHeads.map(head => (
              <option key={head.id} value={head.id}>{head.name}</option>
            ))}
            */}
            <option value="dummy1">Dummy Department Head 1</option>
            <option value="dummy2">Dummy Department Head 2</option>
            <option value="dummy3">Dummy Department Head 3</option>
          </select>
          {errors.departmentHead && <span className="invalid">{errors.departmentHead.message}</span>}
        </div>
      </div>
    </Col>
    <Col md="4">
      <div className="form-group">
        <label className="form-label" htmlFor="startedOn">
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
    <Col md="4">
      <div className="form-group">
        <label className="form-label" htmlFor="status">
          Status <span  className="error">*</span>
        </label>
        <div className="form-control-wrap">
          <select
            className="form-control"
            {...register('status', { required: "Please select a Status" })}
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

export default Departments;
