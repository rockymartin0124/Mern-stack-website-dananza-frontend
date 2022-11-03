import { buyerConstants } from '../config';
import { buyerService } from '../services';

export const buyerSavedActions = {
    fetch
};

function fetch()
{
    return dispatch => {
        buyerService.fetch_Saved_Adza()
            .then(
                adzas => dispatch(fetchSuccess(adzas)),
                error => dispatch(fail(error))
            );
    };
}

function fetchSuccess( adzas ) { return { type: buyerConstants.FETCH_SAVED_ADZA, adzas }}
function fail ( error ) { return { type: buyerConstants.ERROR, error}}
