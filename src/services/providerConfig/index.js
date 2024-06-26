const { ProviderConfig } = require('../../database/repositories/providerConfig.repo');
const { DatabaseTableName } = require('../../enums');
const { NotFoundError, ResourceConflictError, InternalServerError } = require('../../libs/exceptions/index');
const { normalizeStrToPascalCase } = require('../../utils');
const { mapDtoToTableFields } = require('../utils');

class ProviderConfigService {
  static async createProviderConfig(providerConfigDto) {
    const { userId, serviceProviderId} = providerConfigDto;
    
    const providerConfig = await ProviderConfig.getbyUserIdAndServiceProvider({userId, serviceProviderId});
    if (providerConfig) throw new ResourceConflictError('Provider Configuration already exist');
    
    const createdProviderConfig = await ProviderConfig.create({
      ...providerConfigDto, 
      user: userId, 
      serviceProvider: serviceProviderId
    });
    
    if (!createdProviderConfig) throw new InternalServerError('Unable to save Provider Configuration');
    
    return {
      statusCode: 201,
      message: 'Saved Provider Configuration Successfully!',
      data: { createdProviderConfig }
    }
  }

  static async getProviderConfig(_id) {
    const providerConfig = await ProviderConfig.getById(_id);
    if (!providerConfig) throw new NotFoundError('Provider Configuration Not Found!');

    return {
      message: "Fetched Provider Configuration Successfully!",
      data: { ProviderConfig }
    }
  }  

  static async updateProviderConfig(filter, updateDto) {
    const {_id} = filter;

    const providerConfig = await ProviderConfig.getById(_id);
    if (!providerConfig) throw new NotFoundError('Provider Configuration Not Found!');

    let domainName;
    if (updateDto.domainName) {
      domainName = normalizeStrToPascalCase(updateDto.domainName);
    }

    const updateData = mapDtoToTableFields(DatabaseTableName.PROVIDER_CONFIG, {...updateDto, domainName});
    
    const updatedProviderConfig = await ProviderConfig.update({_id}, updateData);
    if (updatedProviderConfig.modifiedCount !== 1) throw new InternalServerError('Unable to update Provider Confuration field field');

    const fetchProviderConfiguration = await ProviderConfig.getById(_id);

    return {
      message: 'Updated Provider Configurations Successfully!',
      data: { updatedConfig: fetchProviderConfiguration }
    }
  }

  static async deleteProviderConfig(_id) {
    const providerConfig = await ProviderConfig.getById(_id);
    if (!providerConfig) throw new NotFoundError('Provider Configuration Not Found!');

    const deletedProviderConfig = await ProviderConfig.delete(_id);
    if (deletedProviderConfig.deletedCount !== 1) throw new InternalServerError('Unable to delete Provider Configuration!');

    return {
      message: 'Provider Configuration deleted successfully!',
      data: { deletedConfigId: _id }
    }
  }
}

exports.ProviderConfigService = ProviderConfigService;