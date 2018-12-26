import { Component, OnInit, Injector} from '@angular/core';
import { Validators } from '@angular/forms';

import { BaseRerouceFormComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { Category } from '../../categories/shared/category.model'         
import { CategoryService } from '../../categories/shared/category.service'

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseRerouceFormComponent<Entry> implements OnInit {

  categories: Array<Category>

  // Configurações dos componentes
  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: "",
    padFractionalZeros: true,
    nomalizeZeros: true,
    radix: ","
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [ 
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: [ 
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(
    protected entryService : EntryService,
    protected categorySerevice: CategoryService,
    protected injector: Injector
  ) {
    super(injector, new Entry(), entryService,  Entry.fromJson)
   };

  ngOnInit() {
    super.ngOnInit();
    this.loadCategories();
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map (
      ([value, text]) => {
        return {
          text: text,
          value: value
        };
      }
    ); 
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      description: [null, [Validators.maxLength(255)]],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadCategories() {
    this.categorySerevice.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  protected creationPageTitle(): string {
    return 'Cadastro de Novo Lançamento';
  }

  protected editionPageTitle(): string {
    const resourceName = this.resource.name || '';
    return 'Editando Lançamento: ' + resourceName;
  }
  
}
