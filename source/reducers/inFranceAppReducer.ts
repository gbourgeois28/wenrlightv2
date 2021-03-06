import { Action as CreationChecklistAction } from 'Actions/companyCreationChecklistActions'
import { ActionExistingCompany } from 'Actions/existingCompanyActions'
import { Action as HiringChecklist } from 'Actions/hiringChecklistAction'
import { ApiCommuneJson } from 'Components/conversation/select/SelectCommune'
import { omit } from 'ramda'
import { combineReducers } from 'redux'
import { LegalStatus } from 'Selectors/companyStatusSelectors'
import {
	Action as CompanyStatusAction,
	LegalStatusRequirements
} from 'Types/companyTypes'

type Action =
	| CompanyStatusAction
	| CreationChecklistAction
	| HiringChecklist
	| ActionExistingCompany

function companyLegalStatus(
	state: LegalStatusRequirements = {},
	action: Action
): LegalStatusRequirements {
	switch (action.type) {
		case 'COMPANY_IS_SOLE_PROPRIETORSHIP':
			return { ...state, soleProprietorship: action.isSoleProprietorship }

		case 'DEFINE_DIRECTOR_STATUS':
			return { ...state, directorStatus: action.status }
		case 'COMPANY_HAS_MULTIPLE_ASSOCIATES':
			return { ...state, multipleAssociates: action.multipleAssociates }
		case 'COMPANY_IS_MICROENTERPRISE':
			return { ...state, autoEntrepreneur: action.autoEntrepreneur }
		case 'SPECIFY_DIRECTORS_SHARE':
			return { ...state, minorityDirector: action.minorityDirector }
		case 'RESET_COMPANY_STATUS_CHOICE':
			return action.answersToReset ? omit(action.answersToReset, state) : {}
	}
	return state
}

function hiringChecklist(
	state: { [key: string]: boolean } = {},
	action: Action
) {
	switch (action.type) {
		case 'CHECK_HIRING_ITEM':
			return {
				...state,
				[action.name]: action.checked
			}
		case 'INITIALIZE_HIRING_CHECKLIST':
			return Object.keys(state).length
				? state
				: action.checklistItems.reduce(
						(checklist, item) => ({ ...checklist, [item]: false }),
						{}
				  )
		default:
			return state
	}
}

function companyCreationChecklist(
	state: { [key: string]: boolean } = {},
	action: Action
) {
	switch (action.type) {
		case 'CHECK_COMPANY_CREATION_ITEM':
			return {
				...state,
				[action.name]: action.checked
			}
		case 'INITIALIZE_COMPANY_CREATION_CHECKLIST':
			return Object.keys(state).length
				? state
				: action.checklistItems.reduce(
						(checklist, item) => ({ ...checklist, [item]: false }),
						{}
				  )
		case 'RESET_COMPANY_STATUS_CHOICE':
			return {}
		default:
			return state
	}
}

function companyStatusChoice(state: LegalStatus | null = null, action: Action) {
	if (action.type === 'RESET_COMPANY_STATUS_CHOICE') {
		return null
	}
	if (action.type !== 'INITIALIZE_COMPANY_CREATION_CHECKLIST') {
		return state
	}
	return action.statusName
}

const infereLegalStatusFromCategorieJuridique = (
	cat??gorieJuridique: string
) => {
	/*
	Nous utilisons le code entreprise pour connaitre le statut juridique
	(voir https://www.insee.fr/fr/information/2028129)

	En revanche, impossible de diff??rencier EI et auto-entreprise
	https://www.sirene.fr/sirene/public/question.action?idQuestion=2933
	*/

	if (cat??gorieJuridique === '1000') {
		return 'EI'
	}
	if (cat??gorieJuridique === '5498') {
		return 'EURL'
	}
	if (/^54..$/.exec(cat??gorieJuridique)) {
		return 'SARL'
	}
	if (/^55..$/.exec(cat??gorieJuridique)) {
		return 'SA'
	}
	if (cat??gorieJuridique === '5720') {
		return 'SASU'
	}
	if (/^57..$/.exec(cat??gorieJuridique)) {
		return 'SAS'
	}
	return 'NON_IMPL??MENT??'
}

export type Company = {
	siren: string
	cat??gorieJuridique?: string
	statutJuridique?: string
	dateDeCr??ation?: string
	isAutoEntrepreneur?: boolean
	isDirigeantMajoritaire?: boolean
	localisation?: ApiCommuneJson
}

function existingCompany(
	state: Company | null = null,
	action: Action
): Company | null {
	if (!action.type.startsWith('EXISTING_COMPANY::')) {
		return state
	}
	if (action.type === 'EXISTING_COMPANY::RESET') {
		return null
	}
	if (action.type === 'EXISTING_COMPANY::SET_SIREN') {
		return { siren: action.siren }
	}
	if (state && action.type === 'EXISTING_COMPANY::SET_DETAILS') {
		const statutJuridique = infereLegalStatusFromCategorieJuridique(
			action.cat??gorieJuridique
		)
		return {
			...state,
			siren: state.siren,
			statutJuridique,
			dateDeCr??ation: action.dateDeCr??ation
		}
	}
	if (state && action.type === 'EXISTING_COMPANY::SPECIFY_AUTO_ENTREPRENEUR') {
		return { ...state, isAutoEntrepreneur: action.isAutoEntrepreneur }
	}
	if (
		state &&
		action.type === 'EXISTING_COMPANY::SPECIFY_DIRIGEANT_MAJORITAIRE'
	) {
		return { ...state, isDirigeantMajoritaire: action.isDirigeantMajoritaire }
	}
	if (state && action.type === 'EXISTING_COMPANY::ADD_COMMUNE_DETAILS') {
		return { ...state, localisation: action.details }
	}
	return state
}

export default combineReducers({
	companyLegalStatus,
	companyStatusChoice,
	companyCreationChecklist,
	existingCompany,
	hiringChecklist
})
