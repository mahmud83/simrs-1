import React,{Component} from 'react'
import {connect} from 'react-redux'

import MessageAlert from '../part/MessageAlert'

import $ from 'jquery'
$.DataTable = require('datatables.net')

class DataDokter extends Component{
    removeErrorMessageAlert(){
        this.props.dispatch({type:'PAGE_AJAX_ERROR',value:[]});
    }

    render(){
        let {ajaxErrors,...props} = this.props;
        let errorLists = ajaxErrors.map( (val,k) => {
            val.className= 'alert alert-warning';
            return <MessageAlert option={val} onClick={this.removeErrorMessageAlert.bind(this)} />
        });
        return(
            <div className="col-lg-12">
				<div className="row">
					<div className="col-lg-12">
						<ol className="breadcrumb">
							<li><a >Home</a></li>
							<li className="active"><span>Master Data </span></li>
						</ol>
					<h1>Data Dokter </h1>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-12 main-box"> 
						<header className="main-box-header clearfix">
							<h2 className="pull-left">Dokter </h2>
							<div className="filter-block pull-right">
							<a className="btn btn-primary pull-right" data-tombol="tambah">
								<i className="fa fa-plus-circle fa-lg"></i> Tambah Dokter
							</a>
							</div>
						</header>
						<div id="tempat-total-table" className="main-box-body clearfix"></div>
						<div className="main-box-body">
							<LoadDataTable {...props} />
						</div>
                        <div>
                            {errorLists}
                        </div>
					</div>
				</div>
			</div>
        );
    }
}

export default connect( store => {
    return {
        accesstoken:store.loginInfo.accesstoken,
        page:store.dashBoard.page,
        ajaxErrors:store.dashBoard.ajaxErrors,
    };
})(DataDokter);

//=====================================================================================================
class LoadDataTable extends Component{
    componentWillUnmount(){
       //$('#tempat-table-crud table').DataTable().destroy(true);
       if(this.dataTable)this.dataTable.destroy(true);
       $(document).off('click','[data-tombol]');
       $(document).off('submit','form[data-tombol="form"]');
    }
    componentDidMount(){
        window.helmi.that = this;
        this.totalTabel =0;
        this.searchQuery='';
        this.page='master-dokter';
        this.errors=[];

        let {that} = window.helmi;

        this.props.dispatch( dispatch => {
            dispatch({
                type:'UPDATE_MODAL_BODY',value:{
                    body:`<div class="row">
                            <form data-tombol="form">
                                <div class="col-lg-6">
                                <div class="input-group">
                                    <label class="input-group-addon">Nama Dokter
                                        <span class="required"> * </span>
                                    </label>
                                    <input type="text" class="form-control" name="nm_dokter"  />
                                    <input type="hidden" name="id_satuan"  />
                                    <input type="hidden" name="mode"  />
                                </div>
                                <div class="input-group" >
                                    <label class="input-group-addon"> Jenis Kelamin </label>
                                    <select name="jk" class="form-control" >
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div class="input-group" >
                                    <label class="input-group-addon"> Golongan Darah </label>
                                    <select name="gol_drh" class="form-control" >
                                        <option >A</option>
                                        <option >B</option>
                                        <option >O</option>
                                        <option >AB</option>
                                        <option >-</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon">Tempat Lahir</label>
                                    <input type="text" class="form-control" name="tmp_lahir"  /> 
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon">Tanggal Lahir</label>
                                    <input type="text" class="form-control" name="tgl_lahir"  /> 
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon">Agama</label>
                                    <input type="text" class="form-control" name="agama"  /> 
                                </div>
                                <div class="form-group">
                                    <textarea name="almt_tgl" style="margin-top:5px;resize:none;" class="form-control" placeholder="Alamat tempat tinggal"></textarea>
                                </div>
                                </div>
                                <div class="col-lg-6">
                                <div class="form-group">
                                    <textarea name="alumni" style="resize:none;" class="form-control" placeholder="Alumni"></textarea>
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon"> Status Nikah </label>
                                    <select name="stts_nikah" class="form-control" >
                                        <option >Single</option>
                                        <option >Menikah</option>
                                        <option >Janda</option>
                                        <option >Dudha</option>
                                        <option >Jomblo</option>
                                    </select>
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon"> No Ijin Praktek </label>
                                    <input type="text" class="form-control" name="no_ijn_praktek"  />
                                </div>
                                <div class="input-group">
                                    <label class="input-group-addon"> Nomor Telp </label>
                                    <input type="text" class="form-control" name="no_telp"  />
                                </div>
                                </div>
                                
                            </form>
                           </div>
                            <div style="margin-top:15px;" id="pesan-error"></div>`,
                    header:'<h4>Tambah Dokter</h4>',
                    footer:'<button class="btn btn-danger pull-left" data-tombol="simpan">Kirim</button>',
                }
            });
            dispatch({type:'UPDATE_MODAL_SIZE',value:'lg'});
        });
       

       $(document).on('click','[data-tombol]', function(e) {
            e.preventDefault();
               
       		switch($(this).attr('data-tombol')){
                case 'tambah':
                    that.props.dispatch({type:'TOGGLE_MODAL',value:true})
                    break; 
                       
       			case 'simpan': $('form[data-tombol="form"]').trigger('submit'); break;
       			default:break;
       		}
       });
       $(document).on('submit','form[data-tombol="form"]',function(e){
       		let data ={
       			nama_satuan:$('.modal form [name="nama_satuan"]').val() ,
       			id_satuan:$('.modal form [name="id_satuan"]').val() ,
       			mode:$('.modal form [name="mode"]').val() ,
       		};
       		var {that} = window.helmi ;
       		data = {...data,accesstoken:that.props.accesstoken};
       		$.ajax({
       			url: window.helmi.api + that.page +'/insert_update_delete',
       			data,
       			type:'POST',dataType:'json',
       			success:(resp)=>{
       				if(resp.success && resp.message ){
       					if(resp.total){
       						that.totalTabel += parseInt(resp.total,10) ;
       					}
       					$('.modal #pesan-error').html(`
             				<div class="alert alert-success"><strong>Success : </strong>${resp.message}</div>\
             			`);
             			setTimeout(()=>{
             				that.props.dispatch({type:'TOGGLE_MODAL',value:'false'});
             				that.dataTable.ajax.reload(null, false);
             				//that.setDataTable();
             			},1000);
       				}
       			},
       			error:xhr => {
       				if(typeof xhr.responseJSON !== 'undefined'){
                        if(xhr.responseJSON.errors)xhr.responseJSON.error=xhr.responseJSON.errors[0];
             			if(xhr.responseJSON.error){
             				$('.modal #pesan-error').html(`
             					<div class="alert alert-danger"><strong>Error : </strong>${xhr.responseJSON.error.message}</div>
             				`);
             			}
             		}
       			},beforeSend:function(){
       				$('.modal [data-tombol]').attr('disabled','disabled');
       			},complete:function(){
       				$('.modal [data-tombol]').removeAttr('disabled');
       			}
       		});
       		e.preventDefault();
       		
       });
       
        this.dataTable = $('#tempat-table-crud table').DataTable({
            destroy: true,
            processing: true,
            serverSide: true,
            searching: false,
            ajax: {
                url: window.helmi.api + that.page +'?errorcode=false' ,
                data: d => {
                    d.accesstoken = that.props.accesstoken;
                    d.totalrow = that.totalTabel;
                    d.cari = that.searchQuery;
                },
                beforeSend: req => {
                    $('#tempat-table-crud table tbody').html('<tr><td colSpan="3"> <h3>Loading ...</h3> </td></tr>');
                },
                type: "POST", 
                error: xhr => {
                    let errorMsg = {error:'Error Load Data',code:503}
                    if(typeof xhr.responseJSON !== 'undefined'){
                        if(xhr.responseJSON.error)errorMsg.error = xhr.responseJSON.error;
                        if(typeof xhr.responseJSON.accesstoken !== 'undefined'){
                            that.props.dispatch({
                                type:'CHANGE_ACCESSTOKEN',value:xhr.responseJSON.accesstoken
                            });
                        }
                    }
                    that.props.dispatch({
                        type:'PAGE_ERROR',value:errorMsg
                    });
                },
                dataSrc: json => {
                    if(!json.data)json.data=[];
                    if(!json.recordsTotal)json.recordsTotal=0;
                    if(!json.recordsFiltered)json.recordsFiltered=0;
                    if(json.errors){
                        that.props.dispatch({type:'PAGE_AJAX_ERROR',value:json.errors}) ; 
                    }
                    return json;
                }
            },
            columns:[
                {name: "id_dokter",searchable: false,  className: "text-center", width: "5%"},
                {name: "nm_dokter",orderable:false},
                {name: "action",orderable: false,searchable: false, className: "text-center", width: "15%"}
            ],
            bStateSave:true,
            //pagingType:'bootstrap_extended'
        }); 
       
    }

    shouldComponentUpdate() {
        return false;
    }
    
    render(){
        return(
            <div id="tempat-table-crud">
                <table className="table table-striped table-bordered table-hover table-checkable order-column" >
                    <thead>
                        <tr>
                            <th> ID </th>
                            <th> Nama  </th>
                            <th> Action </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan="3"> <h3>Loading ...</h3> </td></tr>
                    </tbody>
                </table>
            
            </div>
        );
    }
}