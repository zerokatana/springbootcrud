import constants from '@/components/constants'

export default {
  name: 'supplier',
  components: {},
  data: function () {
    return {
      visible: false,
      context: 'Supplier',
      supplier: initSupplier(),
      rules: {
        companyName: {
          required: true,
          max: constants.sizes.SIZE_M,
          trigger: 'blur'
        },
        firstName: {
          required: false,
          max: constants.sizes.SIZE_M,
          trigger: 'blur'
        },
        lastName: {
          required: false,
          max: constants.sizes.SIZE_M,
          trigger: 'blur'
        },
        vatNumber: {
          required: true,
          min: constants.sizes.SIZE_XXS,
          max: constants.sizes.SIZE_XS,
          trigger: 'blur'
        },
        irsOffice: {
          required: true,
          max: constants.sizes.SIZE_M,
          trigger: 'blur'
        },
        address: {
          required: false,
          max: constants.sizes.SIZE_M,
          trigger: 'blur'
        },
        zipCode: {
          required: false,
          max: constants.sizes.SIZE_M,
          trigger: 'blur'
        },
        city: {
          required: false,
          max: constants.sizes.SIZE_M,
          trigger: 'blur'
        },
        country: {
          required: false,
          max: constants.sizes.SIZE_M,
          trigger: 'blur'
        }
      }
    }
  },
  created () {
    console.log('Supplier created')
  },
  mounted () {
    this.$events.$on('edit-supplier', eventData => this.onEditSupplier(eventData))
    console.log('Supplier mounted')
  },
  destroyed: function () {
    this.$events.$off('edit-supplier')
    console.log('Supplier destroyed')
  },
  computed: {
    isDeletable: function () {
      return this.supplier.id != null
    }
  },
  methods: {
    onEditSupplier (eventData) {
      console.log('Edit Supplier:' + eventData)
      if (eventData != null) {
        this.$http.get('suppliers/' + eventData.id)
          .then(response => {
            this.supplier = response.data
            this.visible = true
            this.clearValidation()
          })
      } else {
        Object.assign(this.$data.supplier, initSupplier())
        this.visible = true
        this.clearValidation()
      }
    },
    save () {
      this.$refs['supplierForm'].validate().then(() => {
        let _self = this
        if (this.supplier.id != null) {
          // existing supplier, update
          this.$http.patch('suppliers/' + this.supplier.id, this.supplier, {
            // transform the selected roles into URIs, before sending
            transformRequest: [function (data, headers) {
              return _self.transformRequest(data)
            }]
          }).then(response => {
            this.handleSuccess(response)
          }).catch(e => this.handleError(e))
        } else {
          // new supplier, create
          this.$http.post('suppliers', this.supplier, {
            // transform the selected roles into URIs, before sending
            transformRequest: [function (data, headers) {
              return _self.transformRequest(data)
            }]
          }).then(response => this.handleSuccess(response))
            .catch(e => this.handleError(e))
        }
      }).catch(e => {
        console.error('validation FAILED')
      })
    },
    cancel () {
      this.visible = false
      this.clearValidation()
    },
    handleSuccess (response) {
      this.visible = false
      this.successFloat(this.$messages.successAction)
      console.log('fire supplier-edited event')
      this.$events.fire('supplier-edited', this.supplier)
    },
    handleError (e) {
      this.showDefaultError(e)
    },
    confirmDelete () {
      this.$confirm(this.$messages.confirmAction, this.$messages.confirmActionTitle, {
        confirmButtonText: this.$messages.yes,
        cancelButtonText: this.$messages.no,
        cancelButtonClass: 'btn btn-warning',
        confirmButtonClass: 'btn btn-danger',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        // delete supplier
        this.$http.delete('suppliers/' + this.supplier.id).then(response => this.handleSuccess(response))
      })
    },
    transformRequest (data) {
      return JSON.stringify(data)
    },
    clearValidation () {
      if (this.$refs['supplierForm']) {
        this.$refs['supplierForm'].clearValidate()
      }
    }
  }
}

/**
 * Create a new totally empty Supplier
 *
 */
function initSupplier () {
  return {
    id: null,
    companyName: '',
    firstName: '',
    lastName: '',
    vatNumber: '',
    irsOffice: '',
    address: '',
    zipCode: '',
    city: '',
    // eslint-disable-next-line comma-dangle
    country: '',

  }
}
