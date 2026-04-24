export interface IDetalleLibro {
    title: string;
    description?: string | { value: string };
    subject_places?: string[]; // Nota: es 'subject' en singular
    covers?: number[];         // IDs para las portadas
    first_publish_date?: string;
    key: string;
    authors?: Array<{
        author?: { key: string };
    }>;
    subjects?: string[];
}