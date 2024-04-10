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

const Designation = () => {
  const [sm, updateSm] = useState(false);
  const [dataTableData, setDataTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    designationName: ''
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
      designationName: ''
    });
    reset({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isValid = await trigger();
      if (isValid) {
        const response = await axios.post('/designation/add', formData);
        setDataTableData([...dataTableData, response.data]);
        toast.success('Designation added successfully', { position: "top-right" });
        setView({ ...view, add: false });
      } else {
        console.log('Form validation failed');
      }
    } catch (error) {
      console.error('Error adding designation:', error);
      toast.error(error.response.data.message);
    }
  };

  const onEditClick = (cellData) => {
    resetForm();
    // Fetch the data for the cellData from dataTableData and set it to the formData state
    const editedData = dataTableData.find(item => item._id === cellData);
    setFormData(editedData);
    setView({ ...view, edit: true });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/designation/update/${formData._id}`, formData);
      toast.success('Designation updated successfully', { position: "top-right" });

      // Update the dataTableData state with the updated designation data
      setDataTableData(dataTableData.map(item => {
        if (item._id === formData._id) {
          return formData; // Update the data for the edited designation
        }
        return item;
      }));

      resetForm();
      setView({ ...view, edit: false });

    } catch (error) {
      console.error('Error updating designation:', error);
      toast.error('Error updating designation');
    }
  };

  const deleteDesignation = async (id) => {
    try {
      await axios.delete(`/designation/delete/${id}`);
      toast.success('Designation deleted successfully', { position: "top-right" });
      setDataTableData(dataTableData.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting designation:', error);
      toast.error('Error deleting designation');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/designation/get');
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
            deleteDesignation(cellData);
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
      selector:  (row, index) => startIndex + index + 1,
      sortable: false,
      width: '200px'
    },
    {
      name: 'Designation Name',
      selector: (row) => row.designationName,
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

  //--------------pagination-------------------
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = Math.min(startIndex + itemPerPage, dataTableData.length);
  const dataForCurrentPage = dataTableData.slice(startIndex, endIndex);
  //--------------pagination-------------------
    
  return (
    <>
      <Head title="Designations" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Designations</BlockTitle>
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
                        <span>Add Designation</span>
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
            <Col size="12">
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
              title=""
              columns={dataTableColumns}
              data={searchText ? filteredData : dataForCurrentPage}
              pagination
              paginationServer
              paginationTotalRows={searchText ? filteredData.length : dataTableData.length}
              paginationPerPage={itemPerPage}
              paginationComponentOptions={{
                rowsPerPageText: 'Items per page:',
                rangeSeparatorText: 'of',
                selectAllRowsItem: false,
                selectAllRowsItemText: 'All'
              }}
              onChangePage={handlePageChange}
              highlightOnHover
              striped
              progressPending={loading}
              progressComponent={<p>Loading...</p>}
            />
            <ToastContainer />
          </PreviewCard>
        </Block>

        <Modal isOpen={view.add || view.edit} toggle={() => onFormCancel()} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a href="#cancel" className="close" onClick={(ev) => {
              ev.preventDefault();
              onFormCancel();
            }}>
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">{view.edit ? 'Update' : 'Add'} Designation</h5>
              <div className="mt-4">
                <Form className={formClass} onSubmit={view.edit ? handleUpdate : handleSubmit}>
                  <Row className="g-3">
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="designationName">
                          Designation Name <span  className="error">*</span>
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            {...register('designationName', { required: "This field is required" })}
                            className="form-control"
                            value={formData.designationName}
                            onChange={(e) => setFormData({ ...formData, designationName: e.target.value })}
                          />
                          {errors.designationName && <span className="invalid">{errors.designationName.message}</span>}
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
    </>
  );
};

export default Designation;
