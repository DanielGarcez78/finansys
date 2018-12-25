import { BaseResourceModel } from '../../../shared/models/base-resources.model';

export class Category extends BaseResourceModel {
    constructor(        
        public id?: number,
        public name?: string,
        public description?: string
    ) {
        super();
    }
}