import React from "react";
import "react-day-picker/lib/style.css";
import TagEditDialog from "../utility/TagEditModal.js";
import TagBasicEditInfo from "../utility/TagBasicEditInfo.js";
import Search from "../utility/Search.js";
import GeoEditSnip from "../utility/GeoEditSnip.js";
import CookieEditSnip from "../utility/CookieEditSnip.js";
import DeviceEditSnip from "../utility/DeviceEditSnip.js";
import OsEditSnip from "../utility/OsEditSnip.js";
import BrowserEditSnip from "../utility/BrowserEditSnip.js";
import ajaxCall from "../utility/ajaxCall.js";
import Header from "../Layout/Header.js";
import LeftNav from "../Layout/LeftNav.js";
import AllResults from "../AllTagsResults/AllTagsResults.js";
import CarouselModalM from "../utility/CarouselModal";
import universalFunctions from "../utility/UniversalFunctions";
import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faPauseCircle,
    faEnvelopeOpen,
    faUsers,
    faFileUpload,
    faUser,
    faArrowUp,
    faArrowDown,
    faCheckCircle,
    faTags,
    faQuestion,
    faChevronLeft,
    faMobileAlt,
    faDesktop,
    faWindowRestore,
    faGlobeAmericas,
    faCookieBite,
    faSave
} from "@fortawesome/free-solid-svg-icons/";
import {faChartBar} from "@fortawesome/free-regular-svg-icons/";
library.add(faEnvelopeOpen, faUsers, faFileUpload, faUser, faChartBar, faArrowUp, faArrowDown, faCheckCircle, faTags, faQuestion, faChevronLeft, faMobileAlt, faDesktop, faWindowRestore, faGlobeAmericas, faCookieBite);
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {NavLink} from "react-router-dom";



const queryString = require('query-string');
const loadCheck = React.createContext('');
class TagManager extends React.Component {

    loadCheck = new Object();
    constructor(props) {
        super(props);
        const filters = queryString.parse(location.search);
        let tagStatus = (filters.status > "" ? filters.status : "live");
        this.myScrollRef = React.createRef();
        this.state = {
            tagIsPaused: null,
            allResults: false,
            tagTitle: null,
            btnMassEditEnabled: false,
            massEditOption: false,
            massSelect: false,
            massEditArray: [],
            checked: true,
            checkNeutral: "",
            unchecked: false,
            tagIds: [],
            path: "tagmanager",
            ajaxtest: null,
            carouselData: null,
            isLoadingTags: true,
            isShownCarouselModal: false,
            isShownCarousel: false,
            ajaxURL: "/",
            error: null,
            isLoaded: false,
            tags: [],
            title: "Tag Manager",
            tagData: [],
            loadingMessage: <div className="datatable_message">Loading....</div>,
            tagSummary: false,
            maxWidth: "xl",
            isOpen: false,
            isOpenEdit: false,
            loadEdit: false,
            leftNav: {
                policies: false,
                reports: false,
                tags: true
            },
            scroll: "paper",
            name_s: "start_date",
            name_e: "end_date",
            showMyGeo: false,
            showMyCookie: false,
            showMyBasic: true,
            showMyOS: false,
            showMyBrowser: false,
            showMyDevice: false,
            editShowMyBasic: true,
            editShowMyGeo: false,
            editShowMyCookie: false,
            editShowMyOS: false,
            editShowMyBrowser: false,
            editShowMyDevice: false,
            editIsLoaded: false,
            btnTagSaveEnabled: true,
            btnTagSaveText: "Apply Changes",
            editData: [],
            totalRecords: 0,
            totalScanned: 0,
            totalActive: 0,
            totalInactive: 0,
            order: 'name!asc',
            tagSearch: '',
            tagStatus: tagStatus,
            responseMessage: '',
            responseMsgClass: 'error', // CSS class for the response message container
            tagManager: true,
            md5sum: filters.md5sum ? filters.md5sum : null,
            pageSize: 25,
            startRecord: 1,
            endRecord: 25,
            pageNumber: 1,
            limit: 25,
            offset: 0,
            prevPageToggleable: false,
            nextPageToggleable: true,
            tagsDataCall: null
        };
        this.ToggleSetState = this.ToggleSetState.bind(this);
        this.defineTheTitleInHeader = this.defineTheTitleInHeader.bind(this);
        this.goBackTagManagerHandler = this.goBackTagManagerHandler.bind(this);

    }

    componentDidMount() {

        this.fetchTagStats();
        this.fetchDatatable();
        if(this.state.md5sum) {
            //we need to load the all results page
            let tagData = {};
            tagData.md5sum = this.state.md5sum;
            this.allResultsPage({}, tagData);
        }
        this.removeLoading();
    }
    removeLoading = (e) => {
        this.setState({
            isLoadingTags:false,
        });
    }

    defineTheTitleInHeader = (titleHeader) => {
        /*this.setState({
         title: titleHeader
         )}*/
    };
    onClickHandlerFilter = event => {
        universalFunctions.sendEventGoogleA("Dropdown Filter TagManager",event.target.value, 1);
        this.setState({[event.target.name]: event.target.value}, function () {
            this.resetPagination();
            this.updatePagination();
        });
        this.scrollToMyRef();
    };
    onClickHandlerTopFilter = event => {
        universalFunctions.sendEventGoogleA("Tag Manager Tags Filter",event.target.value, 1);

        this.props.history.push(`/TagManager?status=${event.target.value}`);

        this.setState({[event.target.name]: event.target.value}, function () {
            this.resetPagination();
            this.updatePagination();
            this.fetchTagStats();
        });
        this.scrollToMyRef();
    };


    searchHandler = event => {
        this.setState({[event.target.name]: event.target.value}, function () {
            if (this.state.tagSearch.length >= 2 || this.state.tagSearch.length === 0) {
                this.resetPagination();
                this.updatePagination();
            }
        });
    };
    onFocus = event => {
        universalFunctions.sendEventGoogleA("Tag Manager", "Search Tag Name Filter", 1);
    }
    LaunchImageCarousel = (event, elid, dataCarousel) => {
        if (this.state.isShownCarouselModal === false) {
            if (dataCarousel.length > 0) {
                this.setState({
                    carouselData: dataCarousel
                });
            }
            /*let myResolve = responseData => {

             };
             //Parameters
             let queryParams = {};
             queryParams.controller = 'tagmanager/carousel_images';
             queryParams.elid = elid;

             new Promise(() => {
             ajaxCall
             .get(queryParams)
             .then(responseData => myResolve(responseData));
             });*/
        } else {
            this.setState({
                carouselData: null
            });
        }
        this.setState({
            isShownCarouselModal: !this.state.isShownCarouselModal
        })
    }
    launchMassEdit = () => {
        this.resetEditModal();
        this.setState({
            massEditOption: true,
            isOpenEdit: !this.state.isOpenEdit
        });
    };

    openPreviewWindow() {
        window.open(this.state.editData.preview_link);
    };

    scrollToMyRef = () => {
        this.myScrollRef.current.scrollTop = 0;
    }

    /**
     * Pause / unpause a tag.  The API endpoint requires a POST request.
     */
    pauseTag() {
        let handleResponse = responseData => {
            let message = '';
            if (responseData === undefined) {
                message = 'Unexpected error';
            } else {
                message = responseData.message;

                if (responseData.error === 0) {
                    this.setState({
                        tagIsPaused: this.state.tagIsPaused !== true
                    });
                }
            }
            this.flashMessage(message);
        };

        let queryParams = {};
        queryParams.controller = 'tagmanager/pause';
        queryParams.md5sum = this.state.editData.tag_md5sum;
        queryParams.tag_pause = this.state.tagIsPaused === false ? 't' : 'f';

        new Promise(() => {
            ajaxCall
                .post(queryParams)
                .then(responseData => handleResponse(responseData));
        });
    };

    flashMessage(message) {
        this.setState({
            responseMessage: message,
        });
        setTimeout(function() {
            this.setState({
                responseMessage: false,
            });
        }.bind(this), 4000);
    }

    /**
     * Checks all the checkboxes for tags.
     * Sets the tag md5sums
     * @param event
     */
    checkboxSelectAll = (event) => {
        let checked = event.target.checked;

        //grab all the md5sums from this.tags
        let tags = this.state.tags;
        let tagIds = [];

        if (tags && tags.length > 1) {
            tags.forEach(function (data) {
                tagIds.push(data.md5sum);
            });
        }

        if (checked === true) {
            this.setState({
                tagIds: tagIds,
                massSelect: true,
                btnMassEditEnabled: true
            })
        } else {
            this.setState({
                tagIds: [],
                massSelect: false,
                btnMassEditEnabled: false
            })
        }
    };

    turnOffMassEdit() {
        this.setState({
            tagIds: [],
            massSelect: false,
            btnMassEditEnabled: false,
        })
    }

    resetMassEditModal = () => {
        this.setState({
            massSelect: false,
            massEditOption: false
        });
    };
    /**
     *
     * @param {object} event
     * @param {string} id
     */
    onInputChange = (event, id) => {
        let checked = event.target.checked;
        let array = [...this.state.tagIds];
        let index = array.indexOf(id);

        let state = {};
        state.massSelect = false;

        if (checked === true) {
            let selIds = this.state.tagIds;
            selIds.push(id);
            state.tagIds = selIds;
        } else {
            if (index !== -1) {
                array.splice(index, 1);
            }
            if (array.length === 0) {
                state.tagIds = [];
            } else {
                state.tagIds = array;
            }
        }

        this.setState(state);
    };
    allResultsPageUnShow = () => {
        this.goBackTagManagerHandler();
        //this.props.history.push(`/TagManager`);
    };
    allResultsPage = (event, tagData) => {
        if (tagData === undefined) {
            console.log('Error - ');
            return;
        }

        if (tagData.md5sum.length !== 0) {
            this.setState({
                allResults: true,
                tagManager: false,
                title: "All Results",
                tag_md5sum: tagData.md5sum,
                tagTitle: tagData.name,
                tagIsPaused: tagData.status,
                leftNav: {
                    policies: false,
                    reports: false,
                    tags: true
                },
            });
        } else {
            this.setState({
                allResults: false,
                tagManager: true,
                title: "Tag Manager",
                tagTitle: null,
                tag_md5sum: null,
                tagIsPaused: null,
                leftNav: {
                    policies: false,
                    reports: false,
                    tags: true
                },
            })
        }
    };

    fetchTagData = (event, md5sum) => {
        let myResolve = responseData => {

            this.setState({
                editIsLoaded: true,
                editData: responseData,
                tagIsPaused: responseData.is_paused,
            });
        };

        let queryParams = {};
        queryParams.controller = 'tagmanager/load';
        queryParams.md5sum = md5sum;

        new Promise(() => {
            ajaxCall
                .get(queryParams)
                .then(responseData => myResolve(responseData));
        });

        this.toggleModalEdit();
    };

    execRun10 = (event, md5sum) => {
        let handleResponse = responseData => {
            let msgClass = '';
            let message = '';

            if (responseData === undefined) {
                message = 'Unexpected error';
                msgClass = 'error';
            } else {
                message = responseData.message;
                msgClass = responseData.error !== 1 ? 'info' : 'error';
            }

            this.setState({
                responseMessage: message,
                responseMsgClass: msgClass,
            })
        };

        let queryParams = {};
        queryParams.controller = 'tagmanager/run_ten';
        queryParams.md5sum = md5sum;

        new Promise(() => {
            ajaxCall
                .get(queryParams)
                .then(responseData => handleResponse(responseData));
        });
    };
    goBackTagManagerHandler = () => {

        this.setState({
            tagSummary: false,
            allResults: false,
            tagManager: true,
            title: "Tag Manager",
            leftNav: {
                policies: false,
                reports: false,
                tags: true
            },
        });
        this.props.history.push({search: queryString.stringify({})});
    };

    resetEditModal() {
        this.state.editData = [];
        this.state.editData.date_end = this.state.defaultEndDate;
        this.state.editData.date_start = this.state.defaultStartDate;
        this.state.responseMessage = '';
        this.state.editShowMyBasic = true;
        this.state.editShowMyCookie = false;
        this.state.editShowMyOS = false;
        this.state.editShowMyGeo = false;
        this.state.editShowMyDevice = false;
        this.state.editShowMyBrowser = false;
        this.state.btnTagSaveText = 'Apply Changes';
        this.state.massEditOption = false;
    }

    toggleModalEdit = (status) => {
        this.resetEditModal();

        if (status > "") {
            let editData = {};
            editData.date_end = this.state.defaultEndDate;
            editData.date_start = this.state.defaultStartDate;
            this.setState({
                isOpenEdit: !this.state.isOpenEdit,
                editData: editData,
                btnTagSaveText: 'Save Tag'
            });
        } else {
            if (this.state.massEditOption === true) {
                this.resetMassEditModal();
            } else {
                this.setState({
                    isOpenEdit: !this.state.isOpenEdit,
                });
            }
        }
    }
    ;
    ToggleSetState = (array) => {
        array.forEach((key, index, value) => {
            for (var a in key) {
                var temp = a;
                this.setState({
                    [temp]: key[a]
                });
            }
        });
    };

    ToggleEditModalView(name, e) {
        let statusArray = [
            {"editShowMyBasic": true},
            {"editShowMyCookie": false},
            {"editShowMyOS": false},
            {"editShowMyGeo": false},
            {"editShowMyDevice": false},
            {"editShowMyBrowser": false}
        ];
        e.preventDefault();

        statusArray.forEach(function (key, index, value) {
            for (let a in key) {
                key[a] = name === a;
            }

        });
        this.ToggleSetState(statusArray);
    }

    toggle() {
        e.nativeEvent.stopImmediatePropagation();
    }

    updatePagination() {

        this.setState({
            startRecord: this.state.pageNumber * this.state.pageSize - this.state.pageSize + 1,
            endRecord: this.state.pageNumber * this.state.pageSize,
            limit: this.state.pageSize,
            offset: this.state.pageNumber * this.state.pageSize - this.state.pageSize,
        }, function () {
            this.fetchDatatable();
            this.updatePageButtons();
        });

    }

    updatePageButtons() {
        window.scrollTo(0, 0)
        this.setState({
            prevPageToggleable: parseInt(this.state.startRecord) > 1,
            nextPageToggleable: parseInt(this.state.endRecord) < parseInt(this.state.totalRecords),
        });
    }

    resetPagination() {
        this.state.pageNumber = 1;
    }

    getFilters() {
        let filters = {};
        filters.limit = this.state.limit;
        filters.offset = this.state.offset;
        filters.order = this.state.order;
        filters.status = this.state.tagStatus;
        filters.search = this.state.tagSearch;
        filters.controller = 'tagmanager';
        return filters;
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    fetchDatatable() {
        let myResolve = responseData => {

            this.setState({
                tagsDataCall: true,
                tags: responseData.data,
                defaultStartDate: responseData.defaultStartDate,
                defaultEndDate: responseData.defaultEndDate,
                totalRecords: responseData.list.totalRecords,
            }, function () {

                this.updatePageButtons();
                this.turnOffMassEdit();
            });
        };
        //Parameters
        let queryParams = this.getFilters();
        new Promise(() => {
            ajaxCall
                .get(queryParams)
                .then(responseData => myResolve(responseData));
        });
    }

    /**
     * Fetch tag statistics: active tags, scanned over the past 7 days, inactive
     */
    fetchTagStats() {
        let tagStats = responseData => {
            this.setState({
                totalActive: responseData.active,
                totalScanned: responseData.scanned_past7,
                totalInactive: responseData.paused_expired
            });
        };

        let queryParams = {};
        queryParams.controller = 'tagmanager/stats';
        queryParams.status = this.state.tagStatus === 'all' ? 'live,paused_expired' : this.state.tagStatus;
        queryParams.status += ',scanned_past7';

        new Promise(() => {
            ajaxCall
                .get(queryParams)
                .then(responseData => tagStats(responseData));
        });
    }

    /**
     * Builds a response just like v7 - it needs to save the same way so we reuse code
     */
    getSaveData() {
        let params = {};

        params.tag_name = (this.state.editData.tag_name ? this.state.editData.tag_name : "");
        params.tag_start_date = (this.state.editData.date_start ? this.state.editData.date_start : "");
        params.tag_end_date = (this.state.editData.date_end ? this.state.editData.date_end : "");
        params.tag_ad_tag = (this.state.editData.tag ? this.state.editData.tag : "");
        params.tag_ref = this.getReferrers();
        params.tag_always_use_https = (this.state.editData.https_only ? this.state.editData.https_only : "");
        params.tag_perday = (this.state.editData.scans_per_day ? this.state.editData.scans_per_day : "");
        params.tag_partner_name = (this.state.editData.partner_name ? this.state.editData.partner_name : "");
        params.tag_partner_id = (this.state.editData.partner_id ? this.state.editData.partner_id : "");

        if (this.state.massEditOption !== true) {
            params.controller = 'tagmanager/save';
            params.md5sum = (this.state.editData.tag_md5sum ? this.state.editData.tag_md5sum : "");
            (this.getAgents() ? params.agents = this.getAgents() : '');
            (this.getCookies() ? params.cookies = this.getCookies() : '');
            (this.getGeos() ? params.geos = this.getGeos() : '');
        } else {
            params.controller = 'tagmanager/save_mass';
            (this.state.editData.mass_tag_referrer_check ? params.edit_tag_referrer = true : "");
            (this.state.editData.mass_tag_dates_check ? params.edit_tag_dates = true : "");
            (this.state.editData.mass_tag_partner_check ? params.edit_tag_partner = true : "");
            (this.state.editData.mass_tag_scans_perday_check ? params.edit_tag_scans_perday = true : "");
            params.tag_ids = this.getTagIds();
        }

        return params;
    }

    getReferrers() {
        let referrers = this.state.editData.referrer_url;
        let refs = "";

        if (!referrers || referrers.length < 1) {
            return refs;
        }

        referrers.forEach(function (data) {
            if (refs !== "") {
                refs = refs + "\n";
            }

            refs = refs + data;
        });

        return refs;
    }

    getTagIds() {
        let tags = this.state.tagIds;
        let tagsString = '';

        if (!tags || tags.length < 1) {
            return;
        }

        tags.forEach(function (data) {
            if (tagsString !== "") {
                tagsString = tagsString + "|";
            }

            tagsString = tagsString + data;
        });

        return tagsString;
    }

    getCookies() {
        let cookie = this.state.editData.cookie;

        if (!cookie || cookie.length < 1) {
            return false;
        }

        let cookies = [];
        cookie.forEach(function (data) {
            cookies.push(data.id);
        });

        return cookies;
    };

    getGeos() {
        let geo = this.state.editData.geo;

        if (!geo || geo.length < 1) {
            return false;
        }

        let geos = [];
        geo.forEach(function (data) {
            geos.push(data.id);
        });

        return geos;
    };

    getAgents() {
        let get_os = true;
        let get_device = true;
        let get_browser = true;
        let agents = {};

        if (get_browser) {
            agents['browser'] = {'id': [], 'val': []};

            let browser = this.state.editData.browser;
            if (browser && browser.length > 0) {
                browser.forEach(function (data) {
                    if (data.meta === 'label') {
                        agents['browser'].val.push(data.id);
                    } else {
                        agents['browser'].id.push(data.id);
                    }
                });
            }
        }

        if (get_os) {
            agents['os'] = {'id': [], 'val': []};

            let os = this.state.editData.os;
            if (os && os.length > 0) {
                os.forEach(function (data) {
                    if (data.meta === 'label') {
                        agents['os'].val.push(data.id);
                    } else {
                        agents['os'].id.push(data.id);
                    }
                });
            }
        }

        if (get_device) {
            agents['device'] = {'id': [], 'val': []};

            let device = this.state.editData.device;
            if (device && device.length > 0) {
                device.forEach(function (data) {
                    if (data.meta === 'label') {
                        agents['device'].val.push(data.id);
                    } else {
                        agents['device'].id.push(data.id);
                    }
                });
            }
        }

        return JSON.stringify(agents);
    };

    saveTag = event => {
        event.preventDefault();

        //disable the save button
        this.setState({
            btnTagSaveEnabled: false,
        });
        if(this.state.btnTagSaveText == "Save Tag"){
            var action = "Save New Tag";
        } else {
            var action = "Save Edit Tag";
        }
        let myResolve = responseData => {
            if (responseData.success) {
                universalFunctions.sendEventGoogleA("Tag Manager Tag Modal", action, 1);
                this.toggleModalEdit();
                this.fetchDatatable();
            } else {
                this.setState({
                    responseMessage: responseData.message,
                })
            }
            this.setState({
                btnTagSaveEnabled: true,
            });
        };

        let tagData = this.getSaveData();

        new Promise(() => {
            ajaxCall
                .post(tagData)
                .then(responseData => myResolve(responseData));
        });
    };

    prevPage = event => {
        if (this.state.prevPageToggleable) {
            universalFunctions.sendEventGoogleA("Tag Manager Pagination", "Show Previous Page", 1);
            this.setState({pageNumber: this.state.pageNumber - 1}, function () {
                this.updatePagination();
            });
        }
        this.scrollToMyRef();
    };
    nextPage = event => {
        if (this.state.nextPageToggleable) {
            universalFunctions.sendEventGoogleA("Tag Manager Pagination", "Show Next Page", 1);
            this.setState({pageNumber: this.state.pageNumber + 1}, function () {
                this.updatePagination();
            });
        }
        this.scrollToMyRef();
    };
    setupDataTable() {
        if(this.state.tagsDataCall === null){
            //initial page load
            loadCheck.msg = <div className='datatable_message'>Loading...</div>;
        } else if(this.state.tagsDataCall === true && this.state.tags.length !== 0 && this.state.tagsData > 0){
            //when we grab the data
            loadCheck.msg = <div className='datatable_message'>Loading...</div>;
        } else if(this.state.tagsDataCall === true  && this.state.tags.length == 0) {
            //when there isn't any data
            loadCheck.msg = <div className='datatable_message'>There isn't any data for the available selection</div>;
            this.state.tagData = [];
        } else {
            //else remove the message because we've loaded it correctly
            loadCheck.msg = "";
        }
        if(this.state.tags.length > 0){
            this.state.tagData = this.state.tags.map(data => (
                <div className="tag_tags_data" key={data.md5sum}>
                    <label className="click_cont">
                        <input type="checkbox" onChange={() => {
                            this.onInputChange(event, data.md5sum)
                        }} checked={this.state.massSelect === true || this.state.tagIds.includes(data.md5sum)}/><span
                        className="checkmark"/>
                    </label>
                    <div className="tag_tag">
                        <div className="tag_holder">
                            <div className="tag_list">
                                <div className="tag_name">
                                    {data.name}
                                </div>
                                <div className="tag_activeDate">
                                    Active Date: {data.start_date} to {data.end_date}
                                </div>
                                <div className="tag_lastScan">
                                    Last Scan: {data.last_scan}
                                </div>
                                <div className="tag_status">
                                    {
                                        data.status === 0 ? <span><FontAwesomeIcon icon={faCheckCircle}/>  Expired</span> : null
                                    }
                                    {
                                        data.status === 1 ? <span><FontAwesomeIcon icon={faCheckCircle}/>  Active</span> : null
                                    }
                                    {
                                        data.status === 2 ? <span className="red"><FontAwesomeIcon icon={faPauseCircle}/>  Paused</span> : null
                                    }
                                </div>

                            </div>
                            <div className="tag_actions">
                                <button className="tag_all" onClick={(e) => {
                                    this.allResultsPage(e, data)
                                }}>All Results
                                </button>
                                <NavLink className="tag_all" to={`/TagManager/History?md5sum=${data.md5sum}`}>History</NavLink>
                                <button className="tag_edit" onClick={(e) => {
                                    this.fetchTagData(e, data.md5sum)
                                }}>Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ));
        }
    }

    render() {
        const {error, editData } = this.state;

        if (error) {
            return <div>Error: {error.message} </div>;
        } else {
            this.setupDataTable();
        }
        return (


            <div>
                <div>
                    <Header titleCallback={this.defineTheTitleInHeader} title={this.state.title}
                            key={this.state.title} ecosystem={"off"}/>

                    <div className="mdh_main">
                        <LeftNav leftNavData={this.state.leftNav} key={this.state.title} allResults={this.state.allResults} allResultsUnshow={this.allResultsPageUnShow}/>
                        <div className="tag_viewp" id="tag_viewp">

                            {this.state.allResults === true ?
                                <AllResults history={this.props.history} tagTitle={this.state.tagTitle}
                                            launchCarouselImg={this.LaunchImageCarousel}
                                            goBackTagManagerHandler={this.goBackTagManagerHandler.bind(this)}
                                            tag_md5sum={this.state.tag_md5sum} tagStatus={this.state.tagStatus} tagIsPaused={this.state.tagIsPaused}
                                            allResultsGoBack={this.allResultsPage}/> : null}

                            {this.state.tagManager === true && this.state.allResults === false && this.state.tagSummary === false ?
                                <div className="tag_toph_nav">
                                    <div className="tag_filter">
                                        <button name="tagStatus" onClick={this.onClickHandlerTopFilter.bind(this)}
                                                value="live"
                                                className={this.state.tagStatus === 'live' ? 'active' : ''}>Active
                                        </button>
                                        <button name="tagStatus" onClick={this.onClickHandlerTopFilter.bind(this)}
                                                value="paused_expired"
                                                className={this.state.tagStatus === 'paused_expired' ? 'active' : ''}>Inactive
                                        </button>
                                        <button name="tagStatus" onClick={this.onClickHandlerTopFilter.bind(this)}
                                                value="all"
                                                className={this.state.tagStatus === 'all' ? 'active' : ''}>All
                                        </button>
                                    </div>
                                    <div className="tag_toph">
                                        <div className="tag_top_menu">

                                            {this.state.tagStatus === 'live' || this.state.tagStatus === 'all' ?
                                                <div className="tag_toph_first">
                                                    <div className="tag_toph_first_hold">
                                                        <h2>Current Number of Active Tags</h2>
                                                    </div>
                                                    <div className="tag_toph_first_hold">
                                                        <h1>{this.state.totalActive}</h1>
                                                    </div>
                                                </div>
                                                : null}

                                            {this.state.tagStatus === 'live' || this.state.tagStatus === 'all' ?
                                                <div className="tag_toph_second">
                                                    <div className="tag_toph_second_hold">
                                                        <h2>Number of Tags Scanned Over Past 7 Days</h2>
                                                    </div>
                                                    <div className="tag_toph_second_hold">
                                                        <h1>{this.state.totalScanned}</h1>
                                                    </div>
                                                </div>
                                                : null}

                                            {this.state.tagStatus === 'paused_expired' || this.state.tagStatus === 'all' ?
                                                <div className={this.state.tagStatus === 'paused_expired' ? "tag_toph_second all_inactive" : "tag_toph_second"}>
                                                    <div className="tag_toph_second_hold">
                                                        <h2>Number Of Current Inactive Tags</h2>
                                                    </div>
                                                    <div className="tag_toph_second_hold">
                                                        <h1>{this.state.totalInactive}</h1>
                                                    </div>
                                                </div>
                                                : null}

                                        </div>
                                    </div>
                                    <div className="tag_options_row">
                                        <div className="tag_left_tag_options">
                                            <div className="tag_sel_all">
                                                <label className="click_container">
                                                    Select All
                                                    <input value={this.state.massSelect}
                                                           checked={this.state.massSelect === true ? this.state.massSelect : false}
                                                           type="checkbox"
                                                           onChange={this.checkboxSelectAll.bind(this)}/>
                                                    <span className="checkmark"/>
                                                </label>
                                            </div>
                                            <div className="tag_mass_edit">
                                                <button
                                                    onClick={this.launchMassEdit.bind(this)}
                                                    className={this.state.btnMassEditEnabled === true || this.state.tagIds.length > 0 ? "" : "disabled"}
                                                    disabled={this.state.btnMassEditEnabled === true || this.state.tagIds.length > 0 ? "" : "disabled"}
                                                >Mass Edit
                                                </button>
                                            </div>
                                            <div className="add_new_tag">
                                                <button className="tag_add_new"
                                                        onClick={this.toggleModalEdit.bind(this)}>Add
                                                    New Tag <FontAwesomeIcon icon={faTags}/>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="tag_center_tag_options">
                                            <div className="tag_pagination">
                                                <div
                                                    className="tag_list">{universalFunctions.addComma(this.state.startRecord)} - {(this.state.endRecord < this.state.totalRecords ? universalFunctions.addComma(this.state.endRecord) : universalFunctions.addComma(this.state.totalRecords))} of {universalFunctions.addComma(this.state.totalRecords)}</div>
                                                <div className="tag_lr">
                                                    <span onClick={this.prevPage}
                                                          className={this.state.prevPageToggleable ? "left-dir click" : "left-dir"}>&lt;</span>
                                                    <span onClick={this.nextPage}
                                                          className={this.state.nextPageToggleable ? "right-dir click" : "right-dir"}>&gt;</span>
                                                </div>
                                                <div className="tag_sel_listings">
                                                    <select value={this.state.pageSize}
                                                            onChange={this.onClickHandlerFilter.bind(this)}
                                                            name="pageSize">
                                                        <option value="10">10</option>
                                                        <option value="25">25</option>
                                                        <option value="50">50</option>
                                                        <option value="100">100</option>
                                                    </select>
                                                    <span>Per page</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tag_right_tag_options">
                                            <span>
                                                <select value={this.state.order} placeholder="Sort By"
                                                        onChange={this.onClickHandlerFilter.bind(this)} name="order"
                                                        className="tag_options_sortby">
                                                    <option value="start_date!asc">Start Date - Earliest First</option>
                                                    <option value="start_date!desc">Start Date - Latest first</option>
                                                    <option value="end_date!asc">End date - Earliest First</option>
                                                    <option value="end_date!desc">End date - Latest first</option>
                                                    <option value="name!asc">Tag Name A to Z</option>
                                                    <option value="name!desc">Tag Name Z to A</option>
                                                </select>
                                            </span>
                                            <Search>
                                                <input autoComplete="Off" value={this.state.tagSearch}
                                                       onChange={this.searchHandler.bind(this)} name="tagSearch"
                                                       onFocus={ this.onFocus }
                                                       className="tag_search" type="text"
                                                       placeholder="Search Tag Name"/>
                                            </Search>
                                        </div>
                                    </div>
                                    <div className="tag_all_tags">
                                        <div className="tag_row_tags"  ref={ this.myScrollRef }>
                                            { loadCheck.msg }
                                            {this.state.tagData}
                                        </div>
                                    </div>
                                </div>

                                : null}
                        </div>
                    </div>

                </div>

                <TagEditDialog show={this.state.isOpenEdit} onClose={this.toggleModalEdit}>
                    <div className="tag_develop" width={this.state.maxWidth}>
                        {this.state.editShowMyBasic ?
                            <TagBasicEditInfo tagData={editData} key={editData.tag_name}
                                              massEditOption={this.state.massEditOption}/> : null}
                        {this.state.editShowMyGeo ? <GeoEditSnip tagData={editData} key={editData.tag_name}/> : null}
                        {this.state.editShowMyCookie ?
                            <CookieEditSnip tagData={editData} key={editData.tag_name}/> : null}
                        {this.state.editShowMyOS ? <OsEditSnip tagData={editData} key={editData.tag_name}/> : null}
                        {this.state.editShowMyBrowser ?
                            <BrowserEditSnip tagData={editData} key={editData.tag_name}/> : null}
                        {this.state.editShowMyDevice ?
                            <DeviceEditSnip tagData={editData} key={editData.tag_name}/> : null}

                        <div className="tag_nav_buttons">
                            {this.state.editShowMyBasic !== true ? (
                                <button className="tag_nav_btn goback"
                                        onClick={this.ToggleEditModalView.bind(this, 'editShowMyBasic')}>

                                    <FontAwesomeIcon onClick={this.ToggleEditModalView.bind(this, 'editShowMyBasic')} icon={faChevronLeft}/>Go Back</button>
                            ) : null}
                            {this.state.editShowMyCookie !== true ? (
                                <button className="tag_nav_btn coo" onClick={this.ToggleEditModalView.bind(this, 'editShowMyCookie')}>Add Cookies<FontAwesomeIcon onClick={this.ToggleEditModalView.bind(this, 'editShowMyCookie')} icon={faCookieBite}/></button>
                            ) : null}
                            {this.state.editShowMyGeo !== true ? (
                                <button className="tag_nav_btn geo" onClick={this.ToggleEditModalView.bind(this, 'editShowMyGeo')}>Add Geo<FontAwesomeIcon onClick={this.ToggleEditModalView.bind(this, 'editShowMyGeo')}  icon={faGlobeAmericas}/></button>
                            ) : null}
                            {this.state.editShowMyOS !== true ? (
                                <button className="tag_nav_btn geo" onClick={this.ToggleEditModalView.bind(this, 'editShowMyOS')}>Add OS <FontAwesomeIcon onClick={this.ToggleEditModalView.bind(this, 'editShowMyOS')}  icon={faWindowRestore}/></button>
                            ) : null}
                            {this.state.editShowMyBrowser !== true ? (
                                <button className="tag_nav_btn geo" onClick={this.ToggleEditModalView.bind(this, 'editShowMyBrowser')}>Add Browser <FontAwesomeIcon onClick={this.ToggleEditModalView.bind(this, 'editShowMyBrowser')}  icon={faDesktop}/></button>
                            ) : null}
                            {this.state.editShowMyDevice !== true ? (
                                <button className="tag_nav_btn geo" onClick={this.ToggleEditModalView.bind(this, 'editShowMyDevice')}>Add Device<FontAwesomeIcon onClick={this.ToggleEditModalView.bind(this, 'editShowMyDevice')}  icon={faMobileAlt}/></button>
                            ) : null}
                        </div>
                        <div className="footer">
                            {this.state.responseMessage ? (
                                <span className={this.state.responseMsgClass}>{this.state.responseMessage}</span>
                            ) : null}

                            <button onClick={() => {this.pauseTag();}}>{this.state.tagIsPaused === true ? "Unpause Tag" : "Pause Tag"}</button>
                            <button onClick={this.openPreviewWindow.bind(this)}>Preview</button>
                            <button onClick={(e) => {
                                this.execRun10(e, this.state.editData.tag_md5sum);
                            }}>Run 10
                            </button>
                            <button className={this.state.btnTagSaveEnabled === true ? "" : "disabled"}
                                    disabled={this.state.btnTagSaveEnabled === true ? "" : "disabled"}
                                    onClick={this.saveTag.bind(this)}>{this.state.btnTagSaveText}<FontAwesomeIcon icon={faSave}/>
                            </button>
                        </div>
                    </div>
                </TagEditDialog>
                <CarouselModalM show={this.state.isShownCarouselModal} onClose={this.LaunchImageCarousel}
                                carouselData={this.state.carouselData} key={this.state.carouselData}>

                </CarouselModalM>
            </div>
        );
    }
}

export default TagManager;
