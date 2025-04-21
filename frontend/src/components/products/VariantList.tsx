import React from 'react';
import { Box, Grid, Tooltip, Typography } from '@mui/material';
import { ProductDto } from '../../models/Product';
import VariantCard from './VariantCard';
import VariantService from '../../services/VariantService';
import { getChipColor, isLightColor } from '../../utils/colorUtils';
import { VariantDto } from '../../models/Variant';

interface Props {
  product: ProductDto;
  setProduct: React.Dispatch<React.SetStateAction<ProductDto | null>>;
  isSaving: boolean;
}

const VariantList: React.FC<Props> = ({ product, setProduct, isSaving }) => {
  const [loadingVariants, setLoadingVariants] = React.useState<{ [id: string]: boolean }>({});

  const handleVariantChange = (variantId: string, field: keyof ProductDto['variants'][0], value: any) => {
    if (!isSaving) {
      setVariantLoading(variantId, true);
      setProduct(prev => {
        if (!prev) return null;
        const updatedVariants = prev.variants.map(variant =>
          variant.variantId === variantId ? { ...variant, [field]: value } : variant
        );
        return { ...prev, variants: updatedVariants };
      });

      setVariantLoading(variantId, false);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    setVariantLoading(variantId, true);
    await VariantService.deleteVariant(variantId);
    setProduct(prev => {
      if (!prev) return null;
      const updatedVariants = prev.variants.filter(variant => variant.variantId !== variantId);
      return { ...prev, variants: updatedVariants };
    });
    setVariantLoading(variantId, false);
  };

  const setVariantLoading = (id: string, value: boolean) => {
    setLoadingVariants(prev => ({ ...prev, [id]: value }));
  };

  const groupedByColor = product.variants.reduce<Record<string, VariantDto[]>>((acc, variant) => {
    const key = variant.color.toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(variant);
    return acc;
  }, {});

  return (
    <>
      <Box sx={{ mb: 3, p: 2, border: '0.4px solid', borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Available Sizes & Colors:
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(groupedByColor).map(([color, variants]) => (
            <Grid item xs={12} sm={6} md={4} key={color}>
              <Box>
                {/* Color chip with tooltip */}
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.primary',
                      fontSize: '0.85rem',
                      textTransform: 'capitalize',
                    }}
                  >
                    {color}
                  </Typography>

                  <Tooltip title={`${color} (${getChipColor(color)})`} arrow>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: getChipColor(color),
                        border: `1px solid ${isLightColor(getChipColor(color)) ? '#ccc' : '#333'}`,
                      }}
                    />
                  </Tooltip>
                </Box>

                {/* Sizes for this color */}
                <Box display="flex" flexDirection="column" gap={1}>
                  {variants.map(variant => (
                    <Box
                      key={variant.variantId}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        p: '4px 8px',
                        backgroundColor: '#f9f9f9',
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #aaa',
                          borderRadius: 1,
                          fontWeight: 600,
                          fontSize: '1rem',
                          backgroundColor: 'white',
                        }}
                      >
                        {variant.size}
                      </Box>
                      <Typography variant="body2" fontWeight={500}>
                        In Stock: {variant.stock}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {product.variants.map(variant => (
        <VariantCard
          key={variant.variantId}
          variant={variant}
          onChange={handleVariantChange}
          isSaving={isSaving}
          onDelete={handleDeleteVariant}
          isLoading={!!loadingVariants[variant.variantId]}
        />
      ))}
    </>
  );
};

export default VariantList;
