import { BaseValidator, IBaseValidatorOptions } from './base-validator';

export interface IBooleanValidatorOptions extends IBaseValidatorOptions {
    strict: boolean;
}

export class BooleanValidator extends BaseValidator {
    message: string = '{attribute} is not boolean.';
    strict: boolean = false;

    constructor(attributeLabel: string, value: any, options?: IBooleanValidatorOptions) {
        super(attributeLabel, value, options);

        this.setOptions(options);
    }

    protected getOptionNameList(...childrenList: string[][]): string[] {
        return super.getOptionNameList(...childrenList, ['strict']);
    }

    validate(): string | boolean {
        if (!this.isAvailableForValidation()) {
            return false;
        }

        let result = false;

        if (this.strict) {
            result = this.value === true || this.value === false;
        } else {
            // eslint-disable-next-line eqeqeq
            result = this.value == true || this.value == false;
        }

        if (!result) {
            return this.message.replace('{attribute}', this.attributeLabel);
        }

        return false;
    }
}
