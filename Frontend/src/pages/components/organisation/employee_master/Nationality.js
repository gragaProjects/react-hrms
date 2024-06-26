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

const Nationality = () => {
  const [sm, updateSm] = useState(false);
  const [dataTableData, setDataTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    nationalityName: ''
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
      nationalityName: ''
    });
    reset({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isValid = await trigger();
      if (isValid) {
        const response = await axios.post('/nationality/add', formData);
        resetForm();
        setDataTableData([...dataTableData, response.data]);
        toast.success('Nationality added successfully', { position: "top-right" });
        setView({ ...view, add: false });
      } else {
        console.log('Form validation failed');
      }
    } catch (error) {
      console.error('Error adding nationality:', error);
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
      const response = await axios.put(`/nationality/update/${formData._id}`, formData);
      toast.success('Nationality updated successfully', { position: "top-right" });
      setDataTableData(dataTableData.map(item => {
        if (item._id === formData._id) {
          return formData;
        }
        return item;
      }));
      resetForm();
      setView({ ...view, edit: false });
    } catch (error) {
      console.error('Error updating nationality:', error);
      toast.error('Error updating nationality');
    }
  };

  const deleteNationality = async (id) => {
    try {
      await axios.delete(`/nationality/delete/${id}`);
      toast.success('Nationality deleted successfully', { position: "top-right" });
      setDataTableData(dataTableData.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting nationality:', error);
      toast.error('Error deleting nationality');
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
        const response = await axios.get('/nationality/get');
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
            deleteNationality(cellData);
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
      selector:  (row, index) => startIndex + index + 1,//(row, index) => index + 1,
      sortable: false,
      width: '200px'
    },
    {
      name: 'Nationality Name',
      selector: (row) => row.nationalityName,
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = Math.min(startIndex + itemPerPage, dataTableData.length);
  
  const dataForCurrentPage = dataTableData.slice(startIndex, endIndex);

  return (
    <>
      <Head title="Nationalities" />
      <Content>
      <BlockHead size="sm" style={{ marginTop: "50px" }}>
    <BlockBetween>
      <BlockHeadContent>
        <BlockTitle>Nationalities</BlockTitle>
      </BlockHeadContent>
      <BlockHeadContent>
        <Button color="primary" onClick={() => setView({ ...view, add: true })}>
          <Icon name=""></Icon>
          <span>Add Nationalitie</span>
        </Button>
      </BlockHeadContent>
    </BlockBetween>
  </BlockHead>
        {/* <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Nationalities</BlockTitle>
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
                        <span>Add Nationality</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead> */}

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
              <h5 className="title">{view.edit ? 'Update' : 'Add'} Nationality</h5>
              <div className="mt-4">
                <Form className={formClass} onSubmit={view.edit ? handleUpdate : handleSubmit}>
                  <Row className="g-3">
                    <Col md="6">
                      <div className="form-group">
                        <label className="form-label" htmlFor="nationalityName">
                          Nationality Name <span className="error">*</span>
                        </label>
                        <div className="form-control-wrap">
                          <input
                            type="text"
                            {...register('nationalityName', { required: "This field is required" })}
                            className="form-control"
                            value={formData.nationalityName}
                            onChange={(e) => setFormData({ ...formData, nationalityName: e.target.value })}
                          />
                          {errors.nationalityName && <span className="invalid">{errors.nationalityName.message}</span>}
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

export default Nationality;
