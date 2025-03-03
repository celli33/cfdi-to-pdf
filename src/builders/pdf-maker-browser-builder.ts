/* istanbul ignore file */
import { Style, TDocumentDefinitions } from 'pdfmake/interfaces';
import { BuilderInterface } from './builder-interface';
import { DocumentTranslatorInterface } from '../templates/document-translator-interface';
import { AbstractInvoiceData } from '../abstract-invoice-data';
import { getPdfMake, PdfMakeBrowser } from '../pdfmake-builder';
import { StaticCatalogs } from '../catalogs/static-catalogs';
import { CatalogsInterface } from '../catalogs/catalogs-interface';

export class PdfMakerBrowserBuilder<T extends AbstractInvoiceData> implements BuilderInterface<T> {
    private _documentTranslator: DocumentTranslatorInterface<T>;

    private readonly _defaultStyle: Style;

    constructor(documentTranslator: DocumentTranslatorInterface<T>, defaultStyle?: Style) {
        this._documentTranslator = documentTranslator;
        if (!defaultStyle) {
            defaultStyle = {
                font: 'Roboto'
            };
        }
        this._defaultStyle = defaultStyle;
    }

    public build(_data: T, _destination: string, _catalogs: CatalogsInterface = new StaticCatalogs()): Promise<void> {
        console.warn('This method not permitted on browser');

        return Promise.reject('Method not work on browser');
    }

    public buildBase64(data: T, catalogs: CatalogsInterface = new StaticCatalogs()): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                const pdfTemplate = this.buildPdf(data, catalogs);
                const pfdDocGenerator = getPdfMake<PdfMakeBrowser>().createPdf(pdfTemplate);
                pfdDocGenerator.getBase64((pdfBase64) => {
                    resolve(pdfBase64);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public buildPdf(data: T, catalogs: CatalogsInterface): TDocumentDefinitions {
        return this._documentTranslator.translate(data, this._defaultStyle, catalogs);
    }
}
