#!/usr/bin/env zsh

clear

CURRENT_DIR="$(cd "$(dirname -- "$1")" >/dev/null; pwd -P)/$(basename -- "$1")"
SCRIPT_DIR="$(cd "$(dirname -- "$0")" >/dev/null; pwd -P)"

cd "$SCRIPT_DIR"

## -------------------------------------------------------------------------------------------------
## Consts
## -------------------------------------------------------------------------------------------------

export now="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
export xrd="resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3"
export faucet="component_sim1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxhkrefh"

# export account1="account_sim1c956qr3kxlgypxwst89j9yf24tjc7zxd4up38x37zr6q4jxdx9rhma"
# export account1_pub="03c67c51d3dfe5150b5cf266e8eb81ac84cf7c187e80f7acd5153ab2f4fb073ef7"
# export account1_key="64e0307bf65442d1ea9036ad3341b564079df4212c874026765eeb08c361cf78"
# export account1_badge="resource_sim1nfzf2h73frult99zd060vfcml5kncq3mxpthusm9lkglvhsr0guahy:#1#"

# export account2="account_sim1c83r6qw6jsqq2dw37l0uhf0ndp87qw27t6x8p53k0h3e2v2ea2mekw"
# export account2_pub="0359721e3e730586d26a8098b56fb79a75459d5068655acbe1a26f7203fc301ff3"
# export account2_key="cc9485cde58321790ed5c0cf674e35ecb394fcdb77e4ca21325985a5701847f3"
# export account2_badge="resource_sim1ntfe36aa7u4evq37h6t2gctqgahy0wlaxs7yj0q5uxx3xj2eatjkjs:#1#"

# export account=$account1

## -------------------------------------------------------------------------------------------------
## Functions
## -------------------------------------------------------------------------------------------------

bold=$(tput bold)
normal=$(tput sgr0)
log() {
    echo "---------------------------------------------------------------------------------------------------------------------------"
    if [ ! -z "$2" -a "$2" != " " ]; then
        echo "| ℹ️   [debug] " ${bold}$1${normal}
        echo "---------------------------------------------------------------------------------------------------------------------------"
        shift
        echo $*
    else
        echo $*
    fi
    echo "---------------------------------------------------------------------------------------------------------------------------"
}

cfg () { resim show-configs }
acc () { resim show $account }
acc1 () { resim show $account1 }
acc2 () { resim show $account2 }

new () {
    out="$(resim new-account)"

    acc="$(echo $out | grep 'Account component address: ' | awk '{print $4}' | tr -d \\n)"
    pub="$(echo $out | grep 'Public key: ' | awk '{print $3}' | tr -d \\n)"
    key="$(echo $out | grep 'Private key: ' | awk '{print $3}' | tr -d \\n)"
    badge="$(echo $out | grep 'Owner badge: ' | awk '{print $3}' | tr -d \\n)"

    echo "$acc $key $badge"
}

def () { resim show-configs }
def1 () { resim set-default-account $account1 $account1_key $account1_badge; export account=$account1 }
def2 () { resim set-default-account $account2 $account2_key $account2_badge; export account=$account2 }

show() { resim show $1 }

res() {
  resource_name="${1:-PLAYER}"
  resource_address=$(resim show $account | grep "($resource_name)" | sed -r 's/.*(resource_[^:]+).*/\1/')

  echo "$resource_address"
}

ids() {
    nft_name="${1:-PLAYER}"
    nft_count=($(resim show $account | grep "($nft_name)" | awk '{print $3}'))
    if [[ ! -z "$nft_count" ]]; then
        nft_ids=($(resim show $account | grep -A $nft_count "($nft_name)" | tail -n +2 | awk '{print $2}'))
        echo "${nft_ids[@]}"
    else
        echo "No NFTs found"
    fi
}

debug() {
  debug0
  nfts
  debug1
  debug2
}
debug0() {
  out=$(resim call-method $loan_registry_component debug | grep "INFO")
  log "LoanRegistry" $out
}
nfts() {
  out=$(resim call-method $loan_registry_component debug_nfts | grep "INFO")
  log "NFTs" $out
}
debug1() {
  out=$(resim call-method $loan_request_component debug | grep "INFO")
  log "LoanRequest #1" $out
}
debug2() {
  out=$(resim call-method $acc2_loan_request_component debug | grep "INFO")
  log "LoanRequest #2" $out
}

ff() {
  date="$(date -v +${1}d -u +'%Y-%m-%dT%H:%M:%SZ')"
  echo "Advancing ${1} days to ${date}..."
  resim set-current-time ${date}
}

#date -d '1 hour ago' '+%Y-%m-%d'

## -------------------------------------------------------------------------------------------------
## Setup
## -------------------------------------------------------------------------------------------------

resim reset
resim set-current-time ${now}

export acc1_creds=$(new)
export account1="$(cut -d' ' -f1 <<<$acc1_creds)"
export account1_key="$(cut -d' ' -f2 <<<$acc1_creds)"
export account1_badge="$(cut -d' ' -f3 <<<$acc1_creds)"

export acc2_creds=$(new)
export account2="$(cut -d' ' -f1 <<<$acc2_creds)"
export account2_key="$(cut -d' ' -f2 <<<$acc2_creds)"
export account2_badge="$(cut -d' ' -f3 <<<$acc2_creds)"

def1

export $account=$account1

# echo $acc1_creds
# echo $acc2_creds

# resim new-account
# resim new-account

resim show $account

## -------------------------------------------------------------------------------------------------
## Deploy
## -------------------------------------------------------------------------------------------------

export publish_out="$(resim publish .)"

export package="$(echo $publish_out | awk '/package_/{print $4}')"

log "Package deployed" $package

## -------------------------------------------------------------------------------------------------
## Bootstrap
## -------------------------------------------------------------------------------------------------

def1

resim call-function $package Bootstrap bootstrap

export nft_resource=$(res PHONE)
export nft_ids=$(ids PHONE)
export nft_id1="$(cut -d' ' -f1 <<<$nft_ids)"
export nft_id2="$(cut -d' ' -f2 <<<$nft_ids)"

export nft2_resource=$(res FAST)
export nft2_ids=$(ids FAST)
export nft2_id1="$(cut -d' ' -f1 <<<$nft2_ids)"
export nft2_id2="$(cut -d' ' -f2 <<<$nft2_ids)"

def2

resim call-function $package Bootstrap bootstrap

export acc2_nft_resource=$(res PHONE)
export acc2_nft_ids=$(ids PHONE)
export acc2_nft_id1="$(cut -d' ' -f1 <<<$acc2_nft_ids)"
export acc2_nft_id2="$(cut -d' ' -f2 <<<$acc2_nft_ids)"

export acc2_nft2_resource=$(res FAST)
export acc2_nft2_ids=$(ids FAST)
export acc2_nft2_id1="$(cut -d' ' -f1 <<<$acc2_nft2_ids)"
export acc2_nft2_id2="$(cut -d' ' -f2 <<<$acc2_nft2_ids)"

## -------------------------------------------------------------------------------------------------
## Step 0. Instantiating LoanRegistry
## -------------------------------------------------------------------------------------------------

log "Step 0. Instantiating LoanRegistry"

def1

export out="$(resim call-function $package LoanRegistry instantiate_loan_registry)"

export loan_registry_component="$(echo $out | grep 'Component: component_' | awk '{print $3}' | tr -d \\n)"
export loan_registry_resource="$(echo $out | grep 'Resource: resource_' | awk '{print $3}' | tr -d \\n)"
# export loan_registry_owner_badge=$(res OWNER)

echo "---------------------------------------------------------------------------------------------------------------------------"
echo "✅  Deployed package: \t\t $package"
echo "✅  loan_registry_component: \t $loan_registry_component"
echo "✅  loan_registry_resource: \t $loan_registry_resource"
# echo "✅  loan_registry_owner_badge: \t $loan_registry_owner_badge"
echo "---------------------------------------------------------------------------------------------------------------------------"

# resim call-function $package LoanRegistry new_loan_request
# export out="$(resim run ./transactions/new_loan_request.rtm)"
# resim call-method component_sim1cpvs7ulg02ah8mhcc84q7zsj4ta3pfz77uknu29xy50yelakkujqze debug

resim call-method $loan_registry_component debug

## -------------------------------------------------------------------------------------------------
## Step 1. Create a new loan request
## -------------------------------------------------------------------------------------------------

log "Step 1. Create a new loan request"

def1

#export out="$(resim run ./transactions/new_loan_request.rtm)"
export out="$(resim run ./transactions/instantiate_loan_request.rtm)"
echo $out

export loan_request_component="$(echo $out | grep 'Component: component_' | awk '{print $3}' | tr -d \\n)"
export loan_request_resource="$(echo $out | grep 'Resource: resource_' | awk '{print $3}' | tr -d \\n)"
export borrower_resource=$(res BORROWER)

resim call-method $loan_registry_component debug

## -------------------------------------------------------------------------------------------------

log "Step 1.2. Create a new loan request on account 2"

def2

#export out="$(resim run ./transactions/new_loan_request2.rtm)"
export out="$(resim run ./transactions/instantiate_loan_request2.rtm)"
echo $out

export acc2_loan_request_component="$(echo $out | grep 'Component: component_' | awk '{print $3}' | tr -d \\n)"
export acc2_loan_request_resource="$(echo $out | grep 'Resource: resource_' | awk '{print $3}' | tr -d \\n)"

resim call-method $loan_registry_component debug

def1

## -------------------------------------------------------------------------------------------------
## Step 2. Accept loan request and issue a new loan
## -------------------------------------------------------------------------------------------------

log "Step 2. Accept loan request and issue a new loan"

def2
# acc
resim run ./transactions/issue_loan.rtm
# acc

export lender_resource=$(res LENDER)

resim call-method $loan_registry_component debug

def1

debug

#log "should return 'not implemented'"
#resim call-method $loan_request_component take_collateral --proofs $lender_resource:#1# | grep "not implemented"
#
#log "should return 'not authorized'"
#resim call-method $acc2_loan_request_component take_collateral --proofs $lender_resource:#1#  | grep "Unauthorized"

## -------------------------------------------------------------------------------------------------
## Cancel loan request
## -------------------------------------------------------------------------------------------------

#def1
#
#return
#
#resim call-method $loan_request_component cancel_request $borrower_resource:#1# --proofs $borrower_resource:#1#

#log "should return 'not implemented'"
#resim call-method $loan_request_component cancel_request --proofs $borrower_resource:#1# | grep "not implemented"
#
#log "should return 'not authorized'"
#resim call-method $acc2_loan_request_component cancel_request --proofs $borrower_resource:#1# | grep "Unauthorized"

## -------------------------------------------------------------------------------------------------
## Repay a loan
## -------------------------------------------------------------------------------------------------

def1

# return 

resim call-method $loan_request_component repay_loan $xrd:40 $borrower_resource:#1# --proofs $borrower_resource:#1#

debug

## -------------------------------------------------------------------------------------------------
## Take collateral
## -------------------------------------------------------------------------------------------------

def2

ff 7

# return 

resim call-method $loan_request_component take_collateral $lender_resource:#1# --proofs $lender_resource:#1#

debug
































return

export out="$(resim run ./transactions/instantiate_loan_request.rtm)"

echo $out

log "Instantiating a loan listing"

# resim call-function $package NftLoan instantiate_loan_request 0.33
# resim run ./transactions/instantiate_loan_request.rtm
export out="$(resim run ./transactions/instantiate_loan_request.rtm)"

echo $out

export owner_badge=$(res OWNER)
export loan_request_component="$(echo $out | grep 'Component: component_' | awk '{print $3}' | tr -d \\n)"
export loan_request_resource="$(echo $out | grep 'Resource: resource_' | awk '{print $3}' | tr -d \\n)"
# export resource_team="$(echo $out | awk '/─ Resource/{i++}i==2{print $3; exit}')"

echo "---------------------------------------------------------------------------------------------------------------------------"
echo "✅  Deployed package: \t\t\t\t $package"
echo "✅  loan_request_component: \t $loan_request_component"
echo "✅  loan_request_resource: \t\t $loan_request_resource"
echo "---------------------------------------------------------------------------------------------------------------------------"

# resim call-method $loan_request_component debug
# resim call-method $loan_request_component debug2 $xrd:3

## -------------------------------------------------------------------------------------------------

# def2
# resim call-method $loan_request_component debug2 $xrd:3
# resim run ./transactions/debug2.rtm

## -------------------------------------------------------------------------------------------------
## Issue a loan
## -------------------------------------------------------------------------------------------------

log "Accept a loan listing"
def2
acc
resim run ./transactions/issue_loan.rtm
acc

# resim call-method $loan_request_component repay_loan $xrd:3

# resim run -s $account2_key ./transactions/issue_loan.rtm

# acc2

# resim call-method $component method --manifest manifest.rtm
# resim run manifest.rtm

}