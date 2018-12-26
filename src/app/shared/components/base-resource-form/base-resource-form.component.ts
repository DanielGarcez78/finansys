import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseResourceService } from '../../services/base-resources.service';
import { BaseResourceModel } from '../../models/base-resources.model';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

export abstract class BaseRerouceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction : string;
  resourceForm : FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected rout: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder

  constructor(
    protected injector: Injector,
    public resource:  T,
    protected resourceService : BaseResourceService<T>,    
    protected jsonDataToResourceFn:(jasonData: any) => T
  ) { 
    this.rout = injector.get(ActivatedRoute);
    this.router = injector.get(Router);
    this.formBuilder = injector.get(FormBuilder)
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked() {    
    this.setPageTitle()
  }

  submitForm() {
    this.submittingForm = true;
    if(this.currentAction == 'new') {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  // Private Methodes
  protected setCurrentAction() {
    if (this.rout.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';      
    } else {
      this.currentAction = 'edit';
    }
  }

  protected loadResource() {
    if (this.currentAction == 'edit') {
      this.rout.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get("id")))
      )
      .subscribe(
        (resource) => {
          this.resource = resource
          this.resourceForm.patchValue(this.resource) // binds loaded resource data to resource form
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
      );
    }
  }

  protected abstract buildResourceForm() : void;

  protected setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = this.creationPageTitle();
    } else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string {
    return 'Novo';
  }

  protected editionPageTitle(): string {
    return 'Edição';
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.create(resource)
      .subscribe(
        resource => this.actionsForSuccess(resource),
        error => this.actionsForError(error)
      );
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.update(resource)
      .subscribe(
        resource => this.actionsForSuccess(resource),
        error => this.actionsForError(error)
      );
  }

  protected actionsForSuccess(resource: T) {
    toastr.success('Solicitação processada com sucesso')
    const baseComponentPath: string = this.rout.snapshot.parent.url[0].path
    this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
      () => this.router.navigate([baseComponentPath, resource.id.toString(), 'edit'])      
    )    
    this.submittingForm = false;
  }

  private actionsForError(error: any) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação');
    this.submittingForm = false;
    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor tente mais tarde."]
    }
  }




}
