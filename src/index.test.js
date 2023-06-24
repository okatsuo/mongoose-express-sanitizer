import {
  middleware,
} from './'
import mongoose from 'mongoose'

// String

describe('middleware schema validator with attributes of type string', () => {
  const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      minlength: 10,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    resume: {
      type: String,
      maxlength: 30
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    notes: {
      type: String,
      required: false,
    },
  })
        
  const Task = mongoose.model('Task', taskSchema)
    
  const { title, description, status, priority, resume} = Task.schema.tree

  it('should return without errors when all attributes are valid', () => {
    const body = {
      title: 'titleOfTask',
      description: 'description',
      status: 'pending',
      priority: 'low',
      resume: 'resume of task',
    }

    expect(() => middleware({ title, description, status, priority, resume }, body)).not.toThrow()
  })

  it('should return an error when the title is not a string', () => {
    const body = {
      title: 1,
      description: 'description',
      status: 'pending',
      priority: 'low',
    }
    
    expect(() => middleware({ title, description, status, priority }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Expected a string, but received \'number\'.'
    }) 
  })

  it('should return an error when the required title is not sended', () => {
    const body = {
      description: 'description',
      status: 'pending',
      priority: 'low',
    }
    
    expect(() => middleware({ title, description, status, priority }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute title is required.'
    })
  })    

  it('should return an error when the title is less than the minlength', () => {
    const body = {
      title: 'title',
      description: 'description',
      status: 'pending',
      priority: 'low',
    }

    expect(() => middleware({ title, description, status, priority }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The string length must be at least 10.'
    })
  })

  it('should return an error when the reume is more than the maxlength', () => {
    const body = {
      title: 'titleOfTask',
      description: 'description',
      status: 'pending',
      priority: 'low',
      resume: 'resume of task with more than 30 characters'
    }
    
    expect(() => middleware({ title, description, status, priority, resume }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The string length must not exceed 30.'
    })  
  })

  it('should return an error when the status is not the accepted values of enum', () => {
    const body = {
      title: 'titleOfTask',
      description: 'description',
      status: 'status',
      priority: 'low',
    }
    
    expect(() => middleware({ title, description, status, priority }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Invalid value. The value must be one of the following: pending, in-progress, completed.'
    }) 
  })
})

// Number

describe('middleware schema validator with attributes of type number', () => {
  const productSchema = new mongoose.Schema({
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    rating: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
  })

  const Product = mongoose.model('Product', productSchema)

  const { price, quantity, discount, rating } = Product.schema.tree


  it('should return withour error when all attributes are valid', () => {
    const body = {
      price: 1,
      quantity: 1,
      discount: 0,
      rating: 1
    }

    expect(() => middleware({ price, quantity, discount, rating }, body)).not.toThrow()
  })

  it('should return an error when the price is not a number', () => {
    const body = {
      price: 'price',
      quantity: 1,
      discount: 0,
      rating: 1
    }
        
    expect(() => middleware({ price, quantity, discount, rating }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Expected a number, but received \'string\'.'
    }) 
  })

  it('should return an error when the required price is not sended', () => {
    const body = {
      quantity: 1,
      discount: 0,
      rating: 1
    }

    expect(() => middleware({ price, quantity, discount, rating }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute price is required.'
    })
  })

  it('should return an error when the price is less than the min', () => {
    const body = {
      price: -1,
      quantity: 1,
      discount: 0,
      rating: 1
    }

    expect(() => middleware({ price, quantity, discount, rating }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Value -1 is less than the minimum value setted.'
    })
  })

  it('should return an error when the quantity is not a number', () => {
    const body = {
      price: 1,
      quantity: 'quantity',
      discount: 0,
      rating: 1
    }

    expect(() => middleware({ price, quantity, discount, rating }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Expected a number, but received \'string\'.'
    })
  })

  it('should return an error when the required quantity is undefined', () => {
    const body = {
      price: 1,
      quantity: undefined,
      discount: 0,
      rating: 1
    }

    expect(() => middleware({ price, quantity, discount, rating }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute quantity is required.'
    })
  })

  it('should return an error when the required quantity is null', () => {
    const body = {
      price: 1,
      quantity: null,
      discount: 0,
      rating: 1
    }

    expect(() => middleware({ price, quantity, discount, rating }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute quantity is required.'
    })
  })

})

// Boolean

describe('middleware schema validator with attributes of type boolean', () => {
  const inscriptionSchema = new mongoose.Schema({
    isAvailable: {
      type: Boolean,
      required: true,
    },
    isFree: {
      type: Boolean
    }
  })

  const Inscription = mongoose.model('Inscription', inscriptionSchema)

  const { isAvailable, isFree } = Inscription.schema.tree

  it('should return without error when all attributes are valid', () => {
    const body = {
      isAvailable: true,
      isFree: false
    }

    expect(() => middleware({ isAvailable, isFree }, body)).not.toThrow()
  })

  it('should return an error when the required attribute is not sended', () => {
    expect(() => middleware({ isAvailable }, {})).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute isAvailable is required.'
    })
  })

  it('should return an error when the required attribute is null', () => {
    const body = {
      isAvailable: null
    }

    expect(() => middleware({ isAvailable }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute isAvailable is required.'
    })
  })

  it('should return an error when the required attribute is undefined', () => {
    const body = {
      isAvailable: undefined
    }

    expect(() => middleware({ isAvailable }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute isAvailable is required.'
    })
  })

  it('should return an error when the attribute is not a boolean', () => {
    const body = {
      isAvailable: 'true'
    }

    expect(() => middleware({ isAvailable }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Expected a boolean, but received \'string\'.'
    })
  })
})

// Date

describe('middleware schema validator with attributes of type date', () => {
  const userSchema = new mongoose.Schema({
    birthDate: {
      type: Date,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  })

  const User = mongoose.model('User', userSchema)

  const { birthDate, lastLogin } = User.schema.tree

  it('should return without error when all attributes are valid', () => {
    const body = {
      birthDate: new Date(),
      lastLogin: new Date(),
    }

    expect(() => middleware({ birthDate, lastLogin }, body)).not.toThrow()
  })

  it('should return an error when the required attribute is not sended', () => {
    expect(() => middleware({ birthDate }, {})).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute birthDate is required.'
    })
  })

  it('should return an error when the required attribute is null', () => {
    const body = {
      birthDate: null
    }

    expect(() => middleware({ birthDate }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute birthDate is required.'
    })
  })

  it('should return an error when the required attribute is undefined', () => {
    const body = {
      birthDate: undefined
    }

    expect(() => middleware({ birthDate }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute birthDate is required.'
    })
  })

  it('should return an error when the attribute is not a date', () => {
    const body = {
      birthDate: 'birthDate'
    }

    expect(() => middleware({ birthDate }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Expected a valid Date object, but received \'string\'.'
    })
  })
})

// Array

describe('middleware schema validator with attributes of type array', () => {
  const socialNetworkSchema = new mongoose.Schema({
    hobbies: {
      type: Array,
      required: true,
    },
    friends: {
      type: Array,
      enum: ['friend'],
      of: String,
    },
  })

  const SocialNetwork = mongoose.model('socialNetwork', socialNetworkSchema)

  const { hobbies, friends } = SocialNetwork.schema.tree

  it('should return without error when all attributes are valid', () => {
    const body = {
      hobbies: ['hobby'],
      friends: ['friend'],
    }

    expect(() => middleware({ hobbies, friends }, body)).not.toThrow()
  })

  it('should return without error when the attribute is not required and null is sended', () => {
    const body = {
      friends: null,
    }

    expect(() => middleware({ friends }, body)).not.toThrow()
  })

  it('should return without error when the attribute is not required and undefined is sended', () => {
    const body = {
      friends: undefined,
    }

    expect(() => middleware({ friends }, body)).not.toThrow()
  })

  it('should return an error when enum attribute is not valid', () => {
    const body = {
      hobbies: ['hobby'],
      friends: ['joao', 'maria'],
    }

    expect(() => middleware({ hobbies, friends }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'Invalid value in the array. The values must be one of friend.'
    })
  })

  it('should return an error when the required attribute is not sended', () => {
    expect(() => middleware({ hobbies }, {})).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute hobbies is required.'
    })
  })

  it('should return an error when the required attribute is null', () => {
    const body = {
      hobbies: null
    }

    expect(() => middleware({ hobbies }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute hobbies is required.'
    })
  })

  it('should return an error when the required attribute is undefined', () => {
    const body = {
      hobbies: undefined
    }

    expect(() => middleware({ hobbies }, body)).toThrow({
      httpErrorCode: 400,
      internalErrorCode: 1000,
      message: 'The attribute hobbies is required.'
    })
  })

})

// Object

describe('middleware schema validator with attributes of type object', () => {
  const animalSchema = new mongoose.Schema({
    species: String,
    physicalCharacteristics: {
      size: {
        type: String,
      },
    },
    behavior: {
      diet: {
        type: String,
        enum: ['carnivore', 'herbivore', 'omnivore'],
      },
      communication: {
        verbal: {
          type: Boolean,
        },
        nonVerbal: {
          type: Boolean,
        },
      }
    },

  })


  const Animal = mongoose.model('Animal', animalSchema)

  const { size, behavior } = Animal.schema.tree

  it('should return without error when all attributes are valid', () => {
    const body = {
      size: 'big',
      behavior: {
        diet: 'carnivore',
        communication: {
          verbal: true,
          nonVerbal: false,
        },
      },
    }

    expect(() => middleware({ size, behavior }, body)).not.toThrow()
  })

    
})

// isDecimal128

// describe('middleware schema validator with attributes of type isDecimal128', () => {
//   const employeeSchema = new mongoose.Schema({
//     salary: {
//       type: mongoose.Schema.Types.Decimal128,
//       required: true,
//     },
//   })

//   const Employee = mongoose.model('Employee', employeeSchema)

//   const { salary } = Employee.schema.tree

//   it('should return without error when all attributes are valid', () => {
//     const body = {
//       salary: 123.45,
//     }

//     expect(() => middleware({ salary }, body)).not.toThrow()
//   })

//   it('should return without error when the attribute is not required and null is sended', () => {
//     const body = {
//       salary: null,
//     }

//     expect(() => middleware({ salary }, body)).not.toThrow()
//   })

//   it('should return without error when the attribute is not required and undefined is sended', () => {
//     const body = {
//       salary: undefined,
//     }

//     expect(() => middleware({ salary }, body)).not.toThrow()
//   })

//   it('should return an error when the attribute is not a decimal128', () => {
//     const body = {
//       salary: 'salary',
//     }

//     expect(() => middleware({ salary }, body)).toThrow({
//       httpErrorCode: 400,
//       internalErrorCode: 1000,
//       message: 'Expected a valid Decimal128 object, but received \'string\'.'
//     })
//   })
// })

// // isTimestamp,

// describe('middleware schema validator with attributes of type isTimestamp', () => {
//   const employeeSchema = new mongoose.Schema({
//     createdAt: {
//       type: mongoose.Schema.Types.Timestamp,
//       required: true,
//     },
//   })

//   const Employee = mongoose.model('Employee', employeeSchema)

//   const { createdAt } = Employee.schema.tree

//   it('should return without error when all attributes are valid', () => {
//     const body = {
//       createdAt: 123456789,
//     }

//     expect(() => middleware({ createdAt }, body)).not.toThrow()
//   })

// })

// // isValidObjectId

// describe('middleware schema validator with attributes of type isValidObjectId', () => {
//   const employeeSchema = new mongoose.Schema({
//     id: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//   })
  
//   const Employee = mongoose.model('Employee', employeeSchema)

//   const { id } = Employee.schema.tree

//   it('should return without error when all attributes are valid', () => {
//     const body = {}

//     expect(() => middleware({ id }, body)).not.toThrow()
//   })

// })

// // isValidMap

// describe('middleware schema validator with attributes of type isValidMap', () => {
//   const employeeSchema = new mongoose.Schema({
//     map: {
//       type: Map,
//       required: true,
//     },
//   })
  
//   const Employee = mongoose.model('Employee', employeeSchema)

//   const { map } = Employee.schema.tree

//   it('should return without error when all attributes are valid', () => {
//     const body = {
//       map: {
//         key: 'value'
//       }
//     }

//     expect(() => middleware({ map }, body)).not.toThrow()
//   })

// })
// // isValidBuffer

// describe('middleware schema validator with attributes of type isValidBuffer', () => {
//   const employeeSchema = new mongoose.Schema({
//     buffer: {
//       type: Buffer,
//       required: true,
//     },
//   })
  
//   const Employee = mongoose.model('Employee', employeeSchema)

//   const { buffer } = Employee.schema.tree

//   it('should return without error when all attributes are valid', () => {
//     const body = {
//       buffer: Buffer.from('buffer')
//     }

//     expect(() => middleware({ buffer }, body)).not.toThrow()
//   })

// })