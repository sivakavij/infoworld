import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/common';
import {RouteParams, Router} from '@angular/router-deprecated';
import {DelayService} from '../../../service/delayService';
import {SessionUrlHandler} from '../../../shared/infostorage';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

import Knowledge = require("knowledge");

@Component({
    selector: 'list-item',
    templateUrl: '../app/components/profiler.component/list.item.component/list.item.html',
    styleUrls: ['../app/components/profiler.component/list.item.component/list.item.css'],
    providers: [DelayService, SessionUrlHandler, ToastsManager]
})
export class ListItemComponent implements OnInit {
    @Input('listEdit') listEdit: boolean;
    @Input('listItem') listItem: Knowledge[];
    @Input('listTitle') listTitle: string;
    private errorForms: boolean;
    private urlSearch: string;    

    constructor(private _routeParams: RouteParams, private delayAsyn: DelayService, private UrlSession: SessionUrlHandler, private route: Router, public toastr: ToastsManager) {

    }

    ngOnInit() {
        this.urlSearch = this._routeParams.get('profileurl');
        console.log(this.urlSearch);
        console.log(this.listItem);
    }

    private focusOn(elment) {
        elment.focus();
    }

    private AddItem() {
        if (!this.listEdit) {
            this.route.navigate(['ProfilerEdit', { profileurl: this.urlSearch, edit: "edit" }]);
            return;
        }
        
        let list = {
            title: "",
            editStatus: true,
            errorStatus: false
        };

        this.listItem.unshift(list);
    }

    private SaveListData() {
        let self = this;
        self.errorForms = false;
        self.listItem.forEach(function (element) {
            if (!element.title.trim()) {
                self.errorForms = true;
                element.errorStatus = true;
            } else {
                element.errorStatus = false;
            }
        });


        let key = "";
        if (self.listTitle == "Hobbies") {
            key = "knowledge"
        }
        
        if (self.errorForms) {
            let filterNonErrorForms = self.listItem.filter(function (element) {
                return !element.errorStatus;
            });
            self.showError();
            console.log("error*****()()***", filterNonErrorForms);
            self.UrlSession.updateKeyContent(key, filterNonErrorForms);
            return;
        }
        self.showSuccess();
        self.UrlSession.updateKeyContent(key, self.listItem);
    }

    public DeleteList(event, index, model) {
        var self = this;
        model.removeAnim = true;
        var array = self.listItem;
        array.splice(index, 1);
        self.showInfo();
        self.listItem = array;

    }
    
    showSuccess() {
        this.toastr.success('Your data saved!', 'Success !');
    }

    showError() {
        this.toastr.error('Something went wrong!', 'Oops !');
    }

    showWarning() {
        this.toastr.warning('You are deleted something.', 'Alert !');
    }

    showInfo() {
        this.toastr.info('You are deleted something.', 'Information !');
    }
}