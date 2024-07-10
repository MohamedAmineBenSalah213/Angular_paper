import { ObjectWithId } from './object-with-id'

export enum CustomFieldDataType {
  STRING = 0,
  URL = 1,
  DATE = 2,
  BOOLEAN = 3,
  INTEGER = 4,
  FLOAT = 5,
  MONETARY = 6,
}

export const DATA_TYPE_LABELS = [
  {
    id: CustomFieldDataType.BOOLEAN,
    name:`Boolean`,
  },
  {
    id: CustomFieldDataType.DATE,
    name: `Date`,
  },
  {
    id: CustomFieldDataType.INTEGER,
    name:`Integer`,
  },
  {
    id: CustomFieldDataType.FLOAT,
    name: `Number`,
  },
  {
    id: CustomFieldDataType.MONETARY,
    name: `Monetary`,
  },
  {
    id: CustomFieldDataType.STRING,
    name: `Text`,
  },
  {
    id: CustomFieldDataType.URL,
    name: `Url`,
  },
]

export interface customField extends ObjectWithId {
  data_type: CustomFieldDataType
  name: string
  created?: Date
}
