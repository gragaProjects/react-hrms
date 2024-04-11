import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import ProductH from "../../../images/product/h.png";
import Dropzone from "react-dropzone";
import SimpleBar from "simplebar-react";
import {
    Block,
    BlockHead,
    BlockTitle,
    BlockBetween,
    BlockHeadContent,
    BlockDes,
    Icon,
   
    Button,
    DataTableHead,
    DataTableBody,
    DataTableRow,
    DataTableItem,
    PaginationComponent,
    PreviewCard,
    CodeBlock,
  OverlineTitle,
  OutlinedInput,
  } from "../../../components/Component";

  import { Card, DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle, Badge,Label, Input, Row, Col, FormGroup } from "reactstrap";

  import { useForm } from "react-hook-form";
  import { Modal, ModalBody } from "reactstrap";
  import { RSelect } from "../../../components/Component";

  import { toast ,ToastContainer,Bounce  } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import SelectSearch from 'react-select-search';
  import 'react-select-search/style.css'
  //
  import axios from "../../../axios";
const OrganisationInfo = () => {
    const [sm, updateSm] = useState(false);
    const [view, setView] = useState({
        edit: false,
        add: false,
        details: false,
      });

    
      const [files, setFiles] = useState([]);

      const [countryOptions, setCountryOptions] = useState([]);
      const [stateOptions, setStateOptions] = useState([]);
      const [districtOptions, setDistrictOptions] = useState([]);
      const [cityOptions, setCityOptions] = useState([]);
      const [timezoneOptions, setTimezoneOptions] = useState([]);
    
      //scroll off when sidebar shows
      useEffect(() => {
        view.add ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
      }, [view.add])

      const countries = [
        "USA",
        "Canada",
        "United Kingdom",
        "Australia",
        "Germany",
        "France",
        // Add more countries as needed
      ];
      
      const states = [
        "California",
        "Texas",
        "New York",
        "Florida",
        "Illinois",
        // Add more states as needed
      ];
      
      const districts = [
        "District 1",
        "District 2",
        "District 3",
        "District 4",
        "District 5",
        // Add more districts as needed
      ];
      
      const cities = [
        "New York City",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Phoenix",
        // Add more cities as needed
      ];

      //new 6.4.24
      const [organisationData, setOrganisationData] = useState({
        organisationName: '',
        email: '',
        businessDomain: '',
        website: '',
        startedOn: '',
        fax: '',
        poBox: '',
        primaryNo: '',
        secondaryNo: '',
        currency: '',
        symbol: '',
        address: '',
        country: '',
        state: '',
        district: '',
        city: '',
        zipCode: '',
        logo: null
    });

    const [organisationId, setOrganisationId] = useState(null); // Assuming you have an organisationId state

      useEffect(() => {
        fetchOrganisations();
    }, []);

    const fetchOrganisations = async () => {
        try {
            const response = await axios.get('/organisations');
            setOrganisationData(response.data);
            setOrganisationId(response.data?._id)
           // console.log(response.data);
        } catch (error) {
            console.error('Error fetching organisations:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrganisationData({
            ...organisationData,
            [name]: value
        });
    };

    const handleLogoChange = (e) => {
        setOrganisationData({
            ...organisationData,
            logo: e.target.files[0]
        });
    };

    const addOrganisation = async () => {
        try {
            const formData = new FormData();
            Object.keys(organisationData).forEach(key => {
                formData.append(key, organisationData[key]);
            });
            const response = await axios.post('/organisations', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
          //  console.log('Organisation added:', response.data);
            toast.success('Organisation added successfully', {
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
        } catch (error) {
            console.error('Error adding organisation:', error);
            toast.error('Error adding organisation');
        }
    };

    const updateOrganisation = async () => {
        try {
             const formData = new FormData();
      
            Object.keys(organisationData).forEach(key => {
                formData.append(key, organisationData[key]);
            });
           // Iterate through formData and log each key-value pair
            //   for (const [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }
            const response = await axios.patch(`/organisations/${organisationId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // console.log('Organisation updated:', response.data);
            toast.success('Organisation updated successfully', {
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
        } catch (error) {
            console.error('Error updating organisation:', error);
            toast.error('Error updating organisation');
        }
    };

    const resetFields = () => {
      setOrganisationData({
          organisationName: '',
          email: '',
          businessDomain: '',
          website: '',
          startedOn: '',
          fax: '',
          poBox: '',
          primaryNo: '',
          secondaryNo: '',
          currency: '',
          symbol: '',
          address: '',
          country: '',
          state: '',
          district: '',
          city: '',
          zipCode: '',
          logo: null
      });
  };

      //new 6.4.24


      const notify = () => {
        toast.success('Successfully', {
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
        console.log("Sucesss");
      };

      //--------------fetch dropdown  data--------------------
      useEffect(() => {
        fetchCountries();
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
        // Update stateOptions when organisationData.country changes
        fetchStatesByCountry(organisationData.country);
       }, [organisationData.country]);

      useEffect(() => {
        // Update stateOptions when organisationData.state changes
        fetchDistrictsByState(organisationData.state);
       }, [organisationData.state]);

    useEffect(() => {
        // Update districtOptions when organisationData.district changes
        fetchCitiesByDistrict(organisationData.district);
    }, [organisationData.district]);

         //--------------fetch dropdown  data--------------------
  return (
    <>
     <Head title="Organisation Info "></Head>
    <Content>
      <BlockHead size="sm">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle>Organisation Info</BlockTitle>
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
              
            </div>
          </BlockHeadContent>
        </BlockBetween>
      </BlockHead>
      <Block>
      
          <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              {/* <BlockTitle tag="h5">Organisation Info</BlockTitle> */}
              
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <OverlineTitle tag="span" className="preview-title-lg">
              {" "}
               {" "}
            </OverlineTitle>
           
           <Row className="gy-4">
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="organisationName" className="form-label">
                  Organisation Name
                </Label>
                <div className="form-control-wrap">
                  <Input id="organisationName" placeholder="Enter Organisation Name" type="text" name="organisationName" value={organisationData?.organisationName} onChange={handleInputChange} />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </Label>
                <div className="form-control-wrap">
                  <Input id="email" placeholder="Enter Email" type="email" name="email" value={organisationData?.email} onChange={handleInputChange} required />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="businessDomain" className="form-label">
                  Business Domain <span className="text-danger">*</span>
                </Label>
                <div className="form-control-wrap">
                  <Input id="businessDomain" placeholder="Enter Business Domain" type="text" required name="businessDomain" value={organisationData?.businessDomain} onChange={handleInputChange} />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="website" className="form-label">
                  Website <span className="text-danger">*</span>
                </Label>
                <div className="form-control-wrap">
                  <Input id="website" placeholder="Enter Website" type="url" required name="website" value={organisationData?.website} onChange={handleInputChange} />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="startedOn" className="form-label">
                  Started On <span className="text-danger">*</span> (Date)
                </Label>
                <div className="form-control-wrap">
                  <Input id="startedOn" type="date" required name="startedOn" value={organisationData?.startedOn} onChange={handleInputChange} />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="fax" className="form-label">
                  Fax
                </Label>
                <div className="form-control-wrap">
                  <Input id="fax" placeholder="Enter Fax Number" type="tel" name="fax" value={organisationData?.fax} onChange={handleInputChange} />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="poBox" className="form-label">
                  PO Box
                </Label>
                <div className="form-control-wrap">
                  <Input id="poBox" placeholder="Enter PO Box" type="text" name="poBox" value={organisationData?.poBox} onChange={handleInputChange} />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="primaryNo" className="form-label">
                  Primary No <span className="text-danger">*</span>
                </Label>
                <div className="form-control-wrap">
                  <Input id="primaryNo" placeholder="Enter Primary Number" type="tel" required name="primaryNo" value={organisationData?.primaryNo} onChange={handleInputChange} />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="secondaryNo" className="form-label">
                  Secondary No
                </Label>
                <div className="form-control-wrap">
                  <Input id="secondaryNo" placeholder="Enter Secondary Number" type="tel" name="secondaryNo" value={organisationData?.secondaryNo} onChange={handleInputChange} />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="currency" className="form-label" name="currency" value={organisationData?.currency} onChange={handleInputChange}>
                  Currency
                </Label>
                <div className="form-control-wrap">
                  <Input id="currency" placeholder="Enter Currency" type="text" name="currency" value={organisationData?.currency} onChange={handleInputChange}
 />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="symbol" className="form-label">
                  Symbol
                </Label>
                <div className="form-control-wrap">
                  <Input id="symbol" placeholder="Enter Symbol" type="text " name="symbol" value={organisationData?.symbol} onChange={handleInputChange}/>
                </div>
              </div>
            </Col>
            <Col sm="4">
              <FormGroup>
                <Label for="address" className="form-label">
                  Address
                </Label>
                <div className="form-control-wrap">
                  <Input id="address" className="no-resize" defaultValue="" rows="3"  name="address" value={organisationData?.address} onChange={handleInputChange} />
                </div>
              </FormGroup>
            </Col>
            {/* country */}
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="country" className="form-label">
                  Country
                </Label>
                <div className="form-control-wrap" >
                  {/* Assuming 'countries' is an array of country names */}
                  {/* <Input type="select" name="country" id="country"  value={organisationData?.country} onChange={ (e) => {
                           handleInputChange(e);
                           fetchStatesByCountry(e.target.value);
                          }}
>                         <option value="">Select Country</option>
                            {countryOptions.map(country => (
                            <option key={country._id} value={country._id}>{country.countryName}</option>
                          ))}
                  </Input> */}

                  <SelectSearch sm="4" 
                    name="country"
                    id="country"
                    value={organisationData?.country || ''} // Set default value here
                    onChange={(newValue) => {
                      handleInputChange({ target: { name: 'country', value: newValue } });
                      fetchStatesByCountry(newValue);
                    }}
                    options={countryOptions.map(country => ({ name: country.countryName, value: country._id }))}
                    placeholder="Select Country"
                    search
                    style={{ width: '100%' }} 
                  />
                      {/* <Select
                        name="country"
                        id="country"
                        value={organisationData?.country ? { value: organisationData.country._id } : null}
                        onChange={(selectedOption) => {
                          const selectedCountryId = selectedOption ? selectedOption.value : ''; // Extract the _id
                          handleInputChange({ target: { name: 'country', value: selectedCountryId } }); // Pass only the _id
                          fetchStatesByCountry(selectedCountryId); // Also pass only the _id to fetchStatesByCountry
                        }}
                        options={countryOptions.map(country => ({
                          value: country._id,
                          label: country.countryName
                        }))}
                        placeholder="Select Country"
                        isSearchable={true}
                        isClearable={true}
                      /> */}
      



                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="state" className="form-label">
                  State
                </Label>
                <div className="form-control-wrap">
                  {/* Assuming 'states' is an array of state names */}
                  {/* <Input type="select" name="state" id="state" value={organisationData?.state} onChange={ (e) => {
                           handleInputChange(e);
                            fetchDistrictsByState(e.target.value);
                          }}
>                         <option value="">Select State</option>
                          {stateOptions.map(state => (
                            <option key={state._id} value={state._id}>{state.stateName}</option>
                          ))}
                  </Input> */}
                    <SelectSearch
                    name="state"
                    id="state"
                    value={organisationData?.state || ''}
                    onChange={(newValue) => {
                      handleInputChange({ target: { name: 'state', value: newValue } });
                      fetchDistrictsByState(newValue);
                    }}
                    options={stateOptions.map(state => ({ name: state.stateName, value: state._id }))}
                    placeholder="Select State"
                    search
                  />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="district" className="form-label">
                  District
                </Label>
                <div className="form-control-wrap">
                  {/* Assuming 'districts' is an array of district names */}
                  {/* <Input type="select"  id="district" name="district" value={organisationData?.district}
                  // onChange={handleInputChange}
                  onChange={ (e) => {
                    handleInputChange(e);
                    fetchCitiesByDistrict(e.target.value);
                   }}
>                       <option value="">Select District</option>
                     {districtOptions.map(district => (
                            <option key={district._id} value={district._id}>{district.districtName}</option>
                          ))}
                  </Input> */}
                   <SelectSearch
                    name="district"
                    id="district"
                    value={organisationData?.district || ''}
                    onChange={(newValue) => {
                      handleInputChange({ target: { name: 'district', value: newValue } });
                      fetchCitiesByDistrict(newValue);
                    }}
                    options={districtOptions.map(district => ({ name: district.districtName, value: district._id }))}
                    placeholder="Select District"
                    search
                  />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="city" className="form-label">
                  City
                </Label>
                <div className="form-control-wrap">
                  {/* Assuming 'cities' is an array of city names */}
                  {/* <Input type="select" name="city" value={organisationData?.city} onChange={handleInputChange}
 id="city">
  <option value="">Select City</option>
  {cityOptions.map(city => (
                            <option key={city._id} value={city._id}>{city.cityName}</option>
                          ))}
                  </Input> */}
                   <SelectSearch
                    name="city"
                    id="city"
                    value={organisationData?.city || ''}
                    onChange={handleInputChange}
                    options={cityOptions.map(city => ({ name: city.cityName, value: city._id }))}
                    placeholder="Select City"
                    search
                  />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="zipCode" className="form-label">
                  Zip Code
                </Label>
                <div className="form-control-wrap">
                  <Input id="zipCode" placeholder="Enter Zip Code" type="text" name="zipCode" value={organisationData?.zipCode} onChange={handleInputChange}
 />
                </div>
              </div>
            </Col>
            <Col sm="4">
              <div className="form-group">
                <Label htmlFor="logo" className="form-label">
                  Logo
                </Label>
                <div className="form-control-wrap">
                  <div className="form-file">
                    <Input id="logo" type="file" onChange={handleLogoChange}  />
                  </div>
                </div>
              </div>
            </Col>
            
            <Col xs="12" md="12" className="d-flex justify-content-end">
              <Button color="light" className="me-2" onClick={resetFields}>Cancel</Button>
              {/* <Button color="primary" onClick={notify}>Save</Button> */}
              {organisationId ? <Button color="primary" onClick={updateOrganisation}>Update</Button> : <Button color="primary" onClick={addOrganisation}>Save</Button>}
              <ToastContainer />
            </Col>
           
          </Row>
        
         
          </PreviewCard>
        </Block>
         
      </Block>

 

   

      
      {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
    </Content>
    </>
  )
}

export default OrganisationInfo