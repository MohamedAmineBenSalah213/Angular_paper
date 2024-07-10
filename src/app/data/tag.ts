import { MatchingModel } from './matching-model'

export interface tag extends MatchingModel {
  color?: string

  text_color?: string

  is_inbox_tag?: boolean
}
